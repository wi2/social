import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { keccak256, Address } from 'viem';
import MerkleTree from 'merkletreejs';
import { Signer } from 'ethers';

const getAccountAdresses = async () => {
  const wallets = await ethers.getSigners();
  return wallets.map(({ address }) => address as Address);
};

function getTree(users: string[]) {
  const leaves = users.map((address) => keccak256(address as Address));
  return new MerkleTree(leaves, keccak256, { sort: true });
}

function getHexProof(users: Address[], user: string) {
  const tree = getTree(users);
  const leaf = keccak256(user as Address);
  return tree.getHexProof(leaf) as Address[];
}

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  USER_ADDED: 1,
};

// Create and deploy a voting contract instance and play the scenario until the specified step
async function deployAndExecuteUntilStep(step = STEP.CONTRACT_DEPLOYED) {
  const wallets = await ethers.getSigners();
  const [owner, admin, notUser0, notUser1, user2, user3] =
    await getAccountAdresses();
  const SocialFactory = await ethers.getContractFactory('SocialAccount');

  let tree = getTree([admin, user2]);
  let usersAdded = [user2, admin];

  const socialContract = await SocialFactory.deploy(
    owner,
    admin,
    usersAdded,
    tree.getHexRoot()
  );
  await socialContract.waitForDeployment();

  if (step >= STEP.USER_ADDED) {
    usersAdded = [admin, user2, user3];
    const tree = getTree(usersAdded);
    await socialContract
      .connect(wallets[1])
      .addMoreUser([user3], tree.getHexRoot() as Address);
  }
  return socialContract;
}

describe('SocialAccount', function () {
  let wallets: Signer[];
  let owner: Address,
    admin: Address,
    notUser0: Address,
    notUser1: Address,
    user2: Address,
    user3: Address,
    users: Address[];

  beforeEach(async function () {
    [owner, admin, notUser0, notUser1, user2, user3, ...users] =
      await getAccountAdresses();
    wallets = await ethers.getSigners();
  });

  it('isUser should return true', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.USER_ADDED);
    const proof = await getHexProof([admin, user2, user3], user2);
    const isUser = await socialContract
      .connect(wallets[4])
      .isUser(user2, proof);
    assert.isTrue(isUser);
  });

  it('isUser should return false', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.USER_ADDED);
    const proof = await getHexProof([admin, user2, user3], notUser1);
    const isUser = await socialContract
      .connect(wallets[3])
      .isUser(notUser1, proof);
    expect(isUser).to.be.false;
  });

  it('isServiceActive should return true', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const isServiceActive = await socialContract
      .connect(wallets[4])
      .isServiceActive(1);
    expect(isServiceActive).to.be.true;
  });

  it('isServiceActive should return true', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const isServiceActive = await socialContract
      .connect(wallets[4])
      .isServiceActive(2);
    expect(isServiceActive).to.be.true;
  });

  it('addMoreUser: should revert if not admin', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const tree = getTree([admin, user2]);
    const addMoreUser = socialContract
      .connect(wallets[4])
      .addMoreUser(users, tree.getHexRoot() as Address);

    await expect(addMoreUser).to.be.rejectedWith('OnlyAdmin');
  });

  it('should revert toggleServices if not owner', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );

    await expect(
      socialContract.connect(wallets[4]).toggleServices()
    ).revertedWithCustomError(socialContract, 'OwnableUnauthorizedAccount');
  });

  it('should return disabled service', async () => {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );

    await socialContract.connect(wallets[0]).toggleServices();
    const isServiceActive = await socialContract
      .connect(wallets[4])
      .isServiceActive(1);

    assert.isFalse(isServiceActive);
  });
});
