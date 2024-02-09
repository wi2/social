import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialNetWorkMessenger } from '../typechain-types';
import { Signer } from 'ethers';
import { Address, Hex, keccak256, parseGwei, toBytes } from 'viem';
import MerkleTree from 'merkletreejs';

const getAccountAdresses = async () => {
  const wallets = await ethers.getSigners();
  return wallets.map(({ address }) => address as Address);
};

function getTree(users: string[]) {
  const leaves = users.map((address) => keccak256(address as Hex));
  return new MerkleTree(leaves, keccak256, { sort: true });
}

function getHexProof(users: Hex[], user: string) {
  const tree = getTree(users);
  const leaf = keccak256(user as Hex);
  return tree.getHexProof(leaf) as Hex[];
}

const RANDOM_WALLET = ethers.Wallet.createRandom();
const WALLET_SECRET1 = keccak256(toBytes('pass 1'));
const WALLET_SECRET2 = keccak256(toBytes('pass 2'));

const MSG_CID = keccak256(toBytes('1st message'));

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  SUBSCRIBED: 1,
  GET_CHAT_WALLET: 2,
  SENDED_INVITATION: 3,
  ACCEPTED_INVITATION: 4,
  GET_CHAT_SECRET: 5,
  SENDED_MESSAGE: 6,
  CLOSE: 7,
};

async function deployAndExecuteSocial(services = [2]) {
  const wallets = await ethers.getSigners();

  const [owner, admin, notUser1, user2, user3, ...users] =
    await getAccountAdresses();
  const SocialFactory = await ethers.getContractFactory('SocialAccount');
  const contract = await SocialFactory.deploy(owner, admin);

  await contract.waitForDeployment();

  let usersAdded = [user2, admin];

  let tree = getTree([admin, user2]);
  await contract.createSocial(services, [user2], tree.getHexRoot() as Hex, {
    value: parseGwei('2000'),
  });
  usersAdded = [admin, user2, user3, ...users];
  tree = getTree(usersAdded);
  await contract
    .connect(wallets[1])
    .addMoreUser([user3], tree.getHexRoot() as Hex);
  return contract;
}

async function deployAndExecuteUntilStep(
  step = STEP.CONTRACT_DEPLOYED,
  services: number[] = [2]
) {
  const messengerContract = await deployAndExecuteSocial(services);
  const wallets = await ethers.getSigners();
  const [owner, admin, notUser1, user2, user3, ...users] =
    await getAccountAdresses();
  const SocialNetWorkFactory = await ethers.getContractFactory(
    'SocialNetWorkMessenger'
  );
  const messengerContractAddress = await messengerContract.getAddress();
  const SocialNetWorkMessenger = (await SocialNetWorkFactory.deploy(
    messengerContractAddress
  )) as SocialNetWorkMessenger;
  await SocialNetWorkMessenger.waitForDeployment();

  if (step >= STEP.SUBSCRIBED) {
    await SocialNetWorkMessenger.connect(wallets[3]).subscribe(
      RANDOM_WALLET.address,
      getHexProof([admin, user2, user3, ...users], user2)
    );
    await SocialNetWorkMessenger.connect(wallets[4]).subscribe(
      RANDOM_WALLET.address,
      getHexProof([admin, user2, user3, ...users], user3)
    );
  }

  let chatWallet1;
  let chatWallet2;
  if (step >= STEP.GET_CHAT_WALLET) {
    chatWallet1 = await SocialNetWorkMessenger.connect(
      wallets[3]
    ).getChatWallet(user2, getHexProof([admin, user2, user3, ...users], user2));
    chatWallet2 = await SocialNetWorkMessenger.connect(
      wallets[4]
    ).getChatWallet(user3, getHexProof([admin, user2, user3, ...users], user3));
  }

  if (step >= STEP.SENDED_INVITATION) {
    await SocialNetWorkMessenger.connect(wallets[3]).sendInvitation(
      user3,
      getHexProof([admin, user2, user3, ...users], user2)
    );
  }

  if (step >= STEP.ACCEPTED_INVITATION) {
    await SocialNetWorkMessenger.connect(wallets[4]).AcceptInvitation(
      user2,
      getHexProof([admin, user2, user3, ...users], user3),
      WALLET_SECRET1,
      WALLET_SECRET2
    );
  }

  if (step >= STEP.SENDED_MESSAGE) {
    const currentCid = await SocialNetWorkMessenger.connect(
      wallets[4]
    ).getCurrentCID(user2, getHexProof([admin, user2, user3, ...users], user3));
    const proof = getHexProof([currentCid as Hex, MSG_CID], currentCid);
    const tree = getTree([currentCid, MSG_CID]);
    await SocialNetWorkMessenger.connect(wallets[4]).sendMessage(
      MSG_CID,
      user2,
      tree.getHexRoot(),
      proof
    );
  }

  if (step >= STEP.CLOSE) {
    await SocialNetWorkMessenger.connect(wallets[4]).burnChat(
      user2,
      getHexProof([admin, user2, user3, ...users], user2)
    );
  }

  return SocialNetWorkMessenger;
}

describe('SocialNetWorkMessenger Contract', () => {
  let owner: Address;
  let admin: Address;
  let notUser1: Address;
  let user2: Address;
  let user3: Address;
  let users: Address[];
  let wallets: Signer[];

  beforeEach(async () => {
    wallets = await ethers.getSigners();
    [owner, admin, notUser1, user2, user3, ...users] =
      await getAccountAdresses();
  });

  describe('Subscribe', () => {
    it('should emit Subscribe', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SUBSCRIBED
      );
      await expect(
        await SocialNetWorkMessenger.connect(wallets[3]).subscribe(
          RANDOM_WALLET.address,
          getHexProof([admin, user2, user3, ...users], user2)
        )
      )
        .to.emit(SocialNetWorkMessenger, 'Subscribe')
        .withArgs(user2);
    });

    it('should return false', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const hasSubscribe = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).hasSubscribe(
        user2,
        getHexProof([admin, user2, user3, ...users], user2)
      );
      assert.equal(hasSubscribe, false);
    });

    it('should return true', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SUBSCRIBED
      );
      const hasSubscribe = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).hasSubscribe(
        user2,
        getHexProof([admin, user2, user3, ...users], user2)
      );
      assert.equal(hasSubscribe, true);
    });

    it('should return false', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const iAmSubscribe = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).iAmSubscribe(getHexProof([admin, user2, user3, ...users], user2));
      assert.equal(iAmSubscribe, false);
    });

    it('should return true', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SUBSCRIBED
      );
      const iAmSubscribe = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).iAmSubscribe(getHexProof([admin, user2, user3, ...users], user2));
      assert.equal(iAmSubscribe, true);
    });
  });

  describe('invitation', () => {
    it('should emit InvitationSended', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SUBSCRIBED
      );
      await expect(
        await SocialNetWorkMessenger.connect(wallets[3]).sendInvitation(
          user3,
          getHexProof([admin, user2, user3, ...users], user2)
        )
      )
        .to.emit(SocialNetWorkMessenger, 'InvitationSended')
        .withArgs(user2, user3);
    });

    it('should emit InvitationAccepted', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_INVITATION
      );
      await expect(
        await SocialNetWorkMessenger.connect(wallets[4]).AcceptInvitation(
          user2,
          getHexProof([admin, user2, user3, ...users], user3),
          WALLET_SECRET1,
          WALLET_SECRET2
        )
      )
        .to.emit(SocialNetWorkMessenger, 'InvitationAccepted')
        .withArgs(user3, user2);
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_INVITATION
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[3]).sendInvitation(
          user3,
          getHexProof([admin, user2, user3, ...users], user2)
        )
      ).revertedWithCustomError(
        SocialNetWorkMessenger,
        'NotAuthorizeToSendInvit'
      );
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.ACCEPTED_INVITATION
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).AcceptInvitation(
          user2,
          getHexProof([admin, user2, user3, ...users], user3),
          WALLET_SECRET1,
          WALLET_SECRET2
        )
      ).revertedWithCustomError(
        SocialNetWorkMessenger,
        'NotAuthorizeToAcceptInvit'
      );
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_INVITATION
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).getChatSecret(
          user2,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(
        SocialNetWorkMessenger,
        'NotAuthorizeToGetSecret'
      );
    });

    it('should return mysecret', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.ACCEPTED_INVITATION
      );
      const getChatSecret = await SocialNetWorkMessenger.connect(
        wallets[4]
      ).getChatSecret(
        user2,
        getHexProof([admin, user2, user3, ...users], user3)
      );
      assert.equal(getChatSecret, WALLET_SECRET1);
    });
    it('should return mysecret', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.ACCEPTED_INVITATION
      );
      const getChatSecret = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).getChatSecret(
        user3,
        getHexProof([admin, user2, user3, ...users], user2)
      );
      assert.equal(getChatSecret, WALLET_SECRET2);
    });
  });

  describe('Message', () => {
    it('should equal', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_MESSAGE
      );
      const getCurrentCID = await SocialNetWorkMessenger.connect(
        wallets[4]
      ).getCurrentCID(
        user2,
        getHexProof([admin, user2, user3, ...users], user3)
      );
      assert.equal(getCurrentCID, MSG_CID);
    });

    it('should emit MessageSended', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.ACCEPTED_INVITATION
      );
      const currentCid = await SocialNetWorkMessenger.connect(
        wallets[4]
      ).getCurrentCID(
        user2,
        getHexProof([admin, user2, user3, ...users], user3)
      );
      const proof = getHexProof([currentCid as Hex, MSG_CID], currentCid);
      const tree = getTree([currentCid, MSG_CID]);

      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).sendMessage(
          MSG_CID,
          user2,
          tree.getHexRoot(),
          proof
        )
      )
        .to.emit(SocialNetWorkMessenger, 'MessageSended')
        .withArgs(user3, user2, MSG_CID);
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.ACCEPTED_INVITATION
      );
      const currentCid = await SocialNetWorkMessenger.connect(
        wallets[4]
      ).getCurrentCID(
        user2,
        getHexProof([admin, user2, user3, ...users], user3)
      );
      const proof = getHexProof([currentCid as Hex, MSG_CID], MSG_CID);
      const tree = getTree([currentCid, MSG_CID]);

      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).sendMessage(
          MSG_CID,
          user2,
          tree.getHexRoot(),
          proof
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'LastMessageIsNotOk');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_INVITATION
      );
      const currentCid = await SocialNetWorkMessenger.connect(
        wallets[4]
      ).getCurrentCID(
        user2,
        getHexProof([admin, user2, user3, ...users], user3)
      );
      const proof = getHexProof([currentCid as Hex, MSG_CID], MSG_CID);
      const tree = getTree([currentCid, MSG_CID]);

      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).sendMessage(
          MSG_CID,
          user2,
          tree.getHexRoot(),
          proof
        )
      ).revertedWithCustomError(
        SocialNetWorkMessenger,
        'NotAuthorizeToSendMessage'
      );
    });
  });

  describe('Close', () => {
    it('should equal', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_MESSAGE
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).burnChat(
          user2,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      )
        .to.emit(SocialNetWorkMessenger, 'BurnChat')
        .withArgs(user3, user2);
    });
  });

  /////////
  /////////
  describe('OnlyUser', () => {
    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).subscribe(
          RANDOM_WALLET.address,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).hasSubscribe(
          RANDOM_WALLET.address,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).iAmSubscribe(
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).getChatSecret(
          user3,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).getChatWallet(
          user3,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).getCurrentCID(
          user3,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).sendInvitation(
          user3,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).AcceptInvitation(
          user3,
          getHexProof([admin, user2, user3, ...users], notUser1),
          WALLET_SECRET1,
          WALLET_SECRET2
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).burnChat(
          user3,
          getHexProof([admin, user2, user3, ...users], notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });
  });

  /////////
  /////////
  /////////
  /////////
  describe('OnlyService', () => {
    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).subscribe(
          RANDOM_WALLET.address,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).hasSubscribe(
          RANDOM_WALLET.address,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).iAmSubscribe(
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).getChatSecret(
          user3,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).getChatWallet(
          user3,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).getCurrentCID(
          user3,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).sendInvitation(
          user3,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).AcceptInvitation(
          user3,
          getHexProof([admin, user2, user3, ...users], user3),
          WALLET_SECRET1,
          WALLET_SECRET2
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [1]
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).burnChat(
          user3,
          getHexProof([admin, user2, user3, ...users], user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });
  });
});
