import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialNetWork } from '../typechain-types';
import { Signer } from 'ethers';
import { Hex, keccak256, toBytes } from 'viem';
import { getAccountAdresses, getHexProof, getTree } from '../utils/common';

const ARTICLE_CID = keccak256(toBytes('Example article content'));

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  POST_CONTENT: 1,
  FOLLOW: 2,
  UNFOLLOW: 3,
  LIKE: 4,
  UNLIKE: 5,
  PIN: 6,
  UNPIN: 7,
  DISABLED_SERVICE: 8,
};

async function deployAndExecuteSocial() {
  const wallets = await ethers.getSigners();

  const [owner, admin, user2, user3] = await getAccountAdresses();
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
  const socialContract = await deployAndExecuteSocial();
  const wallets = await ethers.getSigners();
  const [, admin, user2, user3] = await getAccountAdresses();
  const SocialNetWorkFactory = await ethers.getContractFactory('SocialNetWork');
  const contractSocialAddress = await socialContract.getAddress();

  const socialNetwork = (await SocialNetWorkFactory.deploy(
    contractSocialAddress
  )) as SocialNetWork;
  await socialNetwork.waitForDeployment();

  const usersAdded = [user2, admin, user3];

  if (step >= STEP.POST_CONTENT) {
    const cid = ARTICLE_CID;
    await socialNetwork
      .connect(wallets[2])
      .postArticle(cid, getHexProof(usersAdded, user2));
  }

  if (step >= STEP.FOLLOW) {
    const proof = getHexProof(usersAdded, user3);
    await socialNetwork.connect(wallets[3]).follow(user2, proof);
  }

  if (step >= STEP.UNFOLLOW) {
    const proof = getHexProof(usersAdded, user3);
    await socialNetwork.connect(wallets[3]).unfollow(user2, proof);
  }

  if (step >= STEP.LIKE) {
    const cid = ARTICLE_CID;
    const proof = getHexProof(usersAdded, user3);
    await socialNetwork.connect(wallets[3]).like(cid, proof);
  }

  if (step >= STEP.UNLIKE) {
    const cid = ARTICLE_CID;
    const proof = getHexProof(usersAdded, user3);
    await socialNetwork.connect(wallets[3]).unlike(cid, proof);
  }

  if (step >= STEP.PIN) {
    const cid = ARTICLE_CID;
    const proof = getHexProof(usersAdded, user3);
    await socialNetwork.connect(wallets[3]).pin(cid, proof);
  }

  if (step >= STEP.UNPIN) {
    const cid = ARTICLE_CID;
    const proof = getHexProof(usersAdded, user3);
    await socialNetwork.connect(wallets[3]).unpin(cid, proof);
  }

  if (step >= STEP.DISABLED_SERVICE) {
    await socialContract.connect(wallets[0]).toggleServices();
  }

  return socialNetwork;
}

describe('SocialNetWork Contract', () => {
  let owner: Hex;
  let admin: Hex;
  let user2: Hex;
  let user3: Hex;
  let notUser1: Hex;
  let wallets: Signer[];
  let usersAdded: Hex[];

  beforeEach(async () => {
    wallets = await ethers.getSigners();
    [owner, admin, user2, user3, notUser1] = await getAccountAdresses();
    usersAdded = [user2, admin, user3];
  });

  describe('OnlyUser', () => {
    it('should revert getLastArticleFrom if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );

      await expect(
        socialNetwork
          .connect(wallets[4])
          .getLastArticleFrom(user2, getHexProof(usersAdded, notUser1))
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert postArticle if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        socialNetwork
          .connect(wallets[4])
          .postArticle(ARTICLE_CID, getHexProof(usersAdded, notUser1))
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert follow if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof(usersAdded, notUser1);
      await expect(
        socialNetwork.connect(wallets[4]).follow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert unfollow if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof(usersAdded, notUser1);
      await expect(
        socialNetwork.connect(wallets[4]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert like if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof(usersAdded, notUser1);
      await expect(
        socialNetwork.connect(wallets[4]).like(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert unlike if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof(usersAdded, notUser1);
      await expect(
        socialNetwork.connect(wallets[4]).unlike(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert pin if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof(usersAdded, notUser1);
      await expect(
        socialNetwork.connect(wallets[4]).pin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
    it('should revert unpin if not authorize(not user)', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof(usersAdded, notUser1);
      await expect(
        socialNetwork.connect(wallets[4]).unpin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
  });

  describe('OnlyService', () => {
    it('should revert getLastArticleFrom if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );

      await expect(
        socialNetwork
          .connect(wallets[2])
          .getLastArticleFrom(user2, getHexProof(usersAdded, user2))
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert postArticle if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      await expect(
        socialNetwork
          .connect(wallets[2])
          .postArticle(ARTICLE_CID, getHexProof(usersAdded, user2))
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert follow if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[2]).follow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert unfollow if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[2]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert like if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[2]).like(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert unlike if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[2]).unlike(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert pin if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[2]).pin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
    it('should revert unpin if service not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.DISABLED_SERVICE
      );
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[2]).unpin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
  });

  describe('Post Article', () => {
    it('should allow a user to post an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const cid = keccak256(toBytes('Example first article content'));

      await expect(
        socialNetwork
          .connect(wallets[2])
          .postArticle(cid, getHexProof(usersAdded, user2))
      )
        .to.emit(socialNetwork, 'ArticlePosted')
        .withArgs(user2, cid);
    });

    it('should allow get last article from user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const lastCid = await socialNetwork
        .connect(wallets[2])
        .getLastArticleFrom(user2, getHexProof(usersAdded, user2));
      assert.equal(lastCid, ARTICLE_CID);
    });

    it('should allow get my last article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const lastCid = await socialNetwork
        .connect(wallets[2])
        .getMyLastArticle();
      assert.equal(lastCid, ARTICLE_CID);
    });
  });

  describe('Follow and Unfollow', () => {
    it('should allow a user to follow another user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const proof = getHexProof(usersAdded, user3);
      await expect(socialNetwork.connect(wallets[3]).follow(user2, proof))
        .to.emit(socialNetwork, 'Followed')
        .withArgs(user3, user2);
    });

    it('should revert follow if already followed', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.FOLLOW);
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[3]).follow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyFollowed');
    });

    it('should allow a user to unfollow another user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.FOLLOW);
      const proof = getHexProof(usersAdded, user3);
      await expect(socialNetwork.connect(wallets[3]).unfollow(user2, proof))
        .to.emit(socialNetwork, 'Unfollowed')
        .withArgs(user3, user2);
    });

    it('should revert unfollow if already unfollowed', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.UNFOLLOW);
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[3]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyUnfollowed');
    });
  });

  describe('Like and Unlike', () => {
    it('should allow a user to like an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const proof = getHexProof(usersAdded, user3);
      await expect(socialNetwork.connect(wallets[3]).like(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Liked')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert like if already liked', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.LIKE);
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[3]).like(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyLiked');
    });

    it('should allow a user to unlike an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.LIKE);
      const proof = getHexProof(usersAdded, user3);
      await expect(socialNetwork.connect(wallets[3]).unlike(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Unliked')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert like if already unliked', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.UNLIKE);
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[3]).unlike(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyUnliked');
    });
  });

  describe('Pin and Unpin', () => {
    it('should allow a user to pin an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const proof = getHexProof(usersAdded, user3);
      await expect(socialNetwork.connect(wallets[3]).pin(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Pinned')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert pin if already pinned', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.PIN);
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[3]).pin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyPinned');
    });

    it('should allow a user to unpin an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.PIN);
      const proof = getHexProof(usersAdded, user3);
      await expect(socialNetwork.connect(wallets[3]).unpin(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Unpinned')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert pin if already unpinned', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.UNPIN);
      const proof = getHexProof(usersAdded, user3);
      await expect(
        socialNetwork.connect(wallets[3]).unpin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyUnpinned');
    });
  });
});
