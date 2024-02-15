import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialNetworkMessenger } from '../typechain-types';
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

const MSG_CID = keccak256(toBytes('1st message'));
const MSG_CID2 = keccak256(toBytes('1st second message'));

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  SENDED_MESSAGE: 3,
  DISABLED_SERVICE: 4,
  CLOSE: 7,
};

async function deployAndExecuteAccountSocial() {
  const wallets = await ethers.getSigners();

  const [owner, admin, user2, user3, notUser1] = await getAccountAdresses();
  const SocialFactory = await ethers.getContractFactory('SocialAccount');
  const usersAdded = [user2, admin, user3];
  const tree = getTree(usersAdded);

  const contract = await SocialFactory.connect(wallets[0]).deploy(
    owner,
    admin,
    usersAdded,
    tree.getHexRoot()
  );
  return contract;
}

async function deployAndExecuteUntilStep(step = STEP.CONTRACT_DEPLOYED) {
  const accountContract = await deployAndExecuteAccountSocial();
  const wallets = await ethers.getSigners();
  const [, admin, user2, user3] = await getAccountAdresses();
  const SocialNetWorkFactory = await ethers.getContractFactory(
    'SocialNetworkMessenger'
  );
  const accountContractAddress = await accountContract.getAddress();
  const SocialNetWorkMessenger = (await SocialNetWorkFactory.deploy(
    accountContractAddress
  )) as SocialNetworkMessenger;
  await SocialNetWorkMessenger.waitForDeployment();

  const usersAdded = [user2, admin, user3];

  if (step >= STEP.SENDED_MESSAGE) {
    const currentCid = await SocialNetWorkMessenger.connect(
      wallets[3]
    ).getCurrentCID(user2, getHexProof(usersAdded, user3));

    const proofCid = getHexProof([currentCid as Hex, MSG_CID], MSG_CID);
    const treeCid = getTree([currentCid, MSG_CID]);
    const proof = getHexProof(usersAdded, user3);
    await SocialNetWorkMessenger.connect(wallets[3]).sendMessage(
      MSG_CID,
      user2,
      proofCid,
      treeCid.getHexRoot(),
      proof
    );
  }

  if (step >= STEP.DISABLED_SERVICE) {
    await accountContract.connect(wallets[0]).toggleServices();
  }

  if (step >= STEP.CLOSE) {
    // enable service before burn chat
    await accountContract.connect(wallets[0]).toggleServices();
    await SocialNetWorkMessenger.connect(wallets[3]).burnChat(
      user2,
      getHexProof(usersAdded, user2)
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
  let wallets: Signer[];
  let usersAdded: Address[];

  beforeEach(async () => {
    wallets = await ethers.getSigners();

    [owner, admin, user2, user3, notUser1] = await getAccountAdresses();
    usersAdded = [user2, admin, user3];
  });

  describe('Message', () => {
    it('getCurrentCID, after 1st message should return sameCid', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_MESSAGE
      );
      const getCurrentCID = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).getCurrentCID(user2, getHexProof(usersAdded, user3));
      assert.equal(getCurrentCID, MSG_CID);
    });

    it('sendMessage should emit MessageSended', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_MESSAGE
      );
      const currentCid = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).getCurrentCID(user2, getHexProof(usersAdded, user3));
      const proofCid = getHexProof([currentCid as Hex, MSG_CID], MSG_CID);
      const treeCid = getTree([currentCid, MSG_CID]);
      const proof = getHexProof(usersAdded, user3);

      await expect(
        SocialNetWorkMessenger.connect(wallets[3]).sendMessage(
          MSG_CID,
          user2,
          proofCid,
          treeCid.getHexRoot(),
          proof
        )
      )
        .to.emit(SocialNetWorkMessenger, 'MessageSended')
        .withArgs(user3, user2, MSG_CID);
    });

    it('Should revert sendMessage if last message is not ok', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_MESSAGE
      );

      const currentCid = await SocialNetWorkMessenger.connect(
        wallets[3]
      ).getCurrentCID(user2, getHexProof(usersAdded, user3));

      const treeCid = getTree([currentCid, MSG_CID2]);
      const proofCid = getHexProof([MSG_CID, MSG_CID2], MSG_CID2);
      const proof = getHexProof(usersAdded, user3);

      await expect(
        SocialNetWorkMessenger.connect(wallets[3]).sendMessage(
          MSG_CID2,
          user2,
          proofCid,
          treeCid.getHexRoot(),
          proof
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'LastMessageIsNotOk');
    });
  });

  describe('Close', () => {
    it('should equal', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.SENDED_MESSAGE
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[3]).burnChat(
          user2,
          getHexProof(usersAdded, user3)
        )
      )
        .to.emit(SocialNetWorkMessenger, 'BurnChat')
        .withArgs(user3, user2);
    });
  });

  /////////
  /////////
  describe('OnlyUser', () => {
    it('getCurrentCID should revert is not user registered', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).getCurrentCID(
          user3,
          getHexProof(usersAdded, notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('burnChat should revert is not user registered', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).burnChat(
          user3,
          getHexProof(usersAdded, notUser1)
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
        STEP.DISABLED_SERVICE
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[3]).getCurrentCID(
          user2,
          getHexProof(usersAdded, user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[3]).burnChat(
          user2,
          getHexProof(usersAdded, user3)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });
  });
});
