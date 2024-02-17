import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialNetworkMessenger } from '../typechain-types';
import { Signer } from 'ethers';
import { Hex, keccak256, toBytes } from 'viem';
import { getAccountAdresses, getHexProof, getTree } from '../utils/common';

const MSG_CID = keccak256(toBytes('1st message'));

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  SENDED_MESSAGE: 1,
  DISABLED_SERVICE: 2,
  CLOSE: 3,
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
    const proof = getHexProof(usersAdded, user3);
    await SocialNetWorkMessenger.connect(wallets[3]).sendMessage(
      MSG_CID,
      user2,
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
  let owner: Hex;
  let admin: Hex;
  let notUser1: Hex;
  let user2: Hex;
  let user3: Hex;
  let wallets: Signer[];
  let usersAdded: Hex[];

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
      const proof = getHexProof(usersAdded, user2);
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).sendMessage(
          MSG_CID,
          user3,
          proof
        )
      )
        .to.emit(SocialNetWorkMessenger, 'MessageSended')
        .withArgs(user2, user3, MSG_CID);
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
    it('Should revert getCurrentCID if not user registered', async () => {
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

    it('should revert sendMessage if service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        SocialNetWorkMessenger.connect(wallets[4]).sendMessage(
          MSG_CID,
          user3,
          getHexProof(usersAdded, notUser1)
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyUser');
    });

    it('Should revert burnChat if not user registered', async () => {
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
    it('should revert getCurrentCID if service is not active', async () => {
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

    it('should revert sendMessage if service is not active', async () => {
      const SocialNetWorkMessenger = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );

      const proof = getHexProof(usersAdded, user2);
      await expect(
        SocialNetWorkMessenger.connect(wallets[2]).sendMessage(
          MSG_CID,
          user3,
          proof
        )
      ).revertedWithCustomError(SocialNetWorkMessenger, 'OnlyService');
    });

    it('should revert burnChat if service is not active', async () => {
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
