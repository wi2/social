import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialNetWork } from '../typechain-types';
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
};

async function deployAndExecuteSocial(services = [1]) {
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
  await contract
    .connect(wallets[1])
    .addService([2], { value: parseGwei('1000') });
  return contract;
}

async function deployAndExecuteUntilStep(
  step = STEP.CONTRACT_DEPLOYED,
  services = [1]
) {
  const socialContract = await deployAndExecuteSocial(services);
  const wallets = await ethers.getSigners();
  const [owner, admin, notUser1, user2, user3, ...users] =
    await getAccountAdresses();
  const SocialNetWorkFactory = await ethers.getContractFactory('SocialNetWork');
  const contractSocialAddress = await socialContract.getAddress();

  const socialNetwork = (await SocialNetWorkFactory.deploy(
    contractSocialAddress
  )) as SocialNetWork;
  await socialNetwork.waitForDeployment();

  if (step >= STEP.POST_CONTENT) {
    const cid = ARTICLE_CID;
    await socialNetwork
      .connect(wallets[3])
      .postArticle(cid, getHexProof([admin, user2, user3, ...users], user2));
  }

  if (step >= STEP.FOLLOW) {
    const proof = getHexProof([admin, user2, user3, ...users], user3);
    await socialNetwork.connect(wallets[4]).follow(user2, proof);
  }

  if (step >= STEP.UNFOLLOW) {
    const proof = getHexProof([admin, user2, user3, ...users], user3);
    await socialNetwork.connect(wallets[4]).unfollow(user2, proof);
  }

  if (step >= STEP.LIKE) {
    const cid = ARTICLE_CID;
    const proof = getHexProof([admin, user2, user3, ...users], user3);
    await socialNetwork.connect(wallets[4]).like(cid, proof);
  }

  if (step >= STEP.UNLIKE) {
    const cid = ARTICLE_CID;
    const proof = getHexProof([admin, user2, user3, ...users], user3);
    await socialNetwork.connect(wallets[4]).unlike(cid, proof);
  }

  if (step >= STEP.PIN) {
    const cid = ARTICLE_CID;
    const proof = getHexProof([admin, user2, user3, ...users], user3);
    await socialNetwork.connect(wallets[4]).pin(cid, proof);
  }

  if (step >= STEP.UNPIN) {
    const cid = ARTICLE_CID;
    const proof = getHexProof([admin, user2, user3, ...users], user3);
    await socialNetwork.connect(wallets[4]).unpin(cid, proof);
  }

  return socialNetwork;
}

describe('SocialNetWork Contract', () => {
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

  describe('OnlyUser', () => {
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      await expect(
        socialNetwork
          .connect(wallets[4])
          .postArticle(
            ARTICLE_CID,
            getHexProof([admin, user2, user3, ...users], notUser1)
          )
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).follow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).like(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).unlike(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });

    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).pin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED
      );
      const proof = getHexProof([admin, user2, user3, ...users], notUser1);
      await expect(
        socialNetwork.connect(wallets[2]).unpin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyUser');
    });
  });

  describe('OnlyService', () => {
    it('should allow get last article from user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        []
      );

      await expect(
        socialNetwork.connect(wallets[4]).getLastArticleFrom(user2)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      await expect(
        socialNetwork
          .connect(wallets[4])
          .postArticle(
            ARTICLE_CID,
            getHexProof([admin, user2, user3, ...users], user2)
          )
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).follow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
    it('should revert is service is not active', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).like(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unlike(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });

    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).pin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'OnlyService');
    });
    it('should revert for non user to post', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(
        STEP.CONTRACT_DEPLOYED,
        [2]
      );
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unpin(ARTICLE_CID, proof)
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
          .connect(wallets[3])
          .postArticle(cid, getHexProof([admin, user2, user3, ...users], user2))
      )
        .to.emit(socialNetwork, 'ArticlePosted')
        .withArgs(cid, user2);
    });

    it('should allow get last article from user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const lastCid = await socialNetwork
        .connect(wallets[3])
        .getLastArticleFrom(user2);
      assert.equal(lastCid, ARTICLE_CID);
    });

    it('should allow get my last article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const lastCid = await socialNetwork
        .connect(wallets[3])
        .getMyLastArticle();
      assert.equal(lastCid, ARTICLE_CID);
    });
  });

  describe('Follow and Unfollow', () => {
    it('should allow a user to follow another user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(socialNetwork.connect(wallets[4]).follow(user2, proof))
        .to.emit(socialNetwork, 'Followed')
        .withArgs(user3, user2);
    });

    it('should allow a user to follow another user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.FOLLOW);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).follow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyFollowed');
    });

    it('should allow a user to unfollow another user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.FOLLOW);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(socialNetwork.connect(wallets[4]).unfollow(user2, proof))
        .to.emit(socialNetwork, 'Unfollowed')
        .withArgs(user3, user2);
    });

    it('should allow a user to unfollow another user', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.UNFOLLOW);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unfollow(user2, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyUnfollowed');
    });
  });

  describe('Like and Unlike', () => {
    it('should allow a user to like an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(socialNetwork.connect(wallets[4]).like(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Liked')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert like an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.LIKE);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).like(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyLiked');
    });

    it('should allow a user to unlike an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.LIKE);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(socialNetwork.connect(wallets[4]).unlike(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Unliked')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert like an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.UNLIKE);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unlike(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyUnliked');
    });
  });

  describe('Pin and Unpin', () => {
    it('should allow a user to pin an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.POST_CONTENT);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(socialNetwork.connect(wallets[4]).pin(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Pinned')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert AlreadyPinned', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.PIN);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).pin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyPinned');
    });

    it('should allow a user to unpin an article', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.PIN);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(socialNetwork.connect(wallets[4]).unpin(ARTICLE_CID, proof))
        .to.emit(socialNetwork, 'Unpinned')
        .withArgs(ARTICLE_CID, user3);
    });

    it('should revert AlreadyUnpinned', async () => {
      const socialNetwork = await deployAndExecuteUntilStep(STEP.UNPIN);
      const proof = getHexProof([admin, user2, user3, ...users], user3);
      await expect(
        socialNetwork.connect(wallets[4]).unpin(ARTICLE_CID, proof)
      ).revertedWithCustomError(socialNetwork, 'AlreadyUnpinned');
    });
  });
});
