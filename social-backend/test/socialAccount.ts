import { ethers } from 'hardhat';
import '@nomicfoundation/hardhat-chai-matchers';
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
  USER_ADDED: 2,
};

// Create and deploy a voting contract instance and play the scenario until the specified step
async function deployAndExecuteUntilStep(step = STEP.CONTRACT_DEPLOYED) {
  const wallets = await ethers.getSigners();
  const [owner, notUser0, notUser1, user2, user3] = await getAccountAdresses();
  const SocialFactory = await ethers.getContractFactory('SocialAccount');

  let tree = getTree([owner, user2]);
  let usersAdded = [user2, owner];

  const socialContract = await SocialFactory.deploy(
    owner,
    usersAdded,
    tree.getHexRoot()
  );
  await socialContract.waitForDeployment();

  /*   if (step >= STEP.CREATED) {
    tree = getTree([owner, user2]);
    await socialContract
      .connect(wallets[0])
      .createSocial([user2], tree.getHexRoot() as Address);
    await socialContract.connect(wallets[0]).addService([1]);
  }*/

  if (step >= STEP.USER_ADDED) {
    usersAdded = [owner, user2, user3];
    const tree = getTree(usersAdded);
    await socialContract
      .connect(wallets[0])
      .addMoreUser([user3], tree.getHexRoot() as Address);
  }
  /*   if (step >= STEP.SERVICE_ADDED) {
    await socialContract.connect(wallets[0]).addService([2]);
  } */
  return socialContract;
}

describe('SocialAccount', function () {
  let wallets: Signer[];
  let owner: Address,
    notUser0: Address,
    notUser1: Address,
    user2: Address,
    user3: Address,
    users: Address[];

  beforeEach(async function () {
    [owner, notUser0, notUser1, user2, user3, ...users] =
      await getAccountAdresses();
    wallets = await ethers.getSigners();
  });

  /*   it('should revert NotAuthorize if not owner', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const tree = getTree([owner, user2]);

    const createSocial = socialContract
      .connect(wallets[3])
      .createSocial([user2], tree.getHexRoot() as Address);

    expect(createSocial).to.be.rejected;
  }); */

  it('isUser should return true', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.USER_ADDED);
    const proof = await getHexProof([owner, user2, user3], user2);
    const isUser = await socialContract
      .connect(wallets[3])
      .isUser(user2, proof);
    assert.isTrue(isUser);
  });

  it('isUser should return false', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.USER_ADDED);
    const proof = await getHexProof([owner, user2, user3], notUser1);
    const isUser = await socialContract
      .connect(wallets[2])
      .isUser(notUser1, proof);
    console.log(isUser);
    expect(isUser).to.be.false;
  });

  it('isServiceActive should return true', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const isServiceActive = await socialContract
      .connect(wallets[3])
      .isServiceActive(1);
    expect(isServiceActive).to.be.true;
  });

  /*   it('isServiceActive should return false', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.CREATED);
    const isServiceActive = await socialContract
      .connect(wallets[3])
      .isServiceActive(2);
    expect(isServiceActive).to.be.false;
  }); */

  it('isServiceActive should return true', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const isServiceActive = await socialContract
      .connect(wallets[3])
      .isServiceActive(2);
    expect(isServiceActive).to.be.true;
  });

  /*   it('addService should revert with InsufficientPayment', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.CREATED);
    const addService = socialContract.write.addService([[2]], {
      value: parseGwei('999'),
      account: owner,
    });
    await expect(addService).to.be.rejectedWith('InsufficientPayment()');
  });
 */

  /*   it('addService should revert with NotAuthorize', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.CREATED);
    const addService = socialContract.connect(wallets[3]).addService([2]);
    await expect(addService).to.be.rejectedWith('OwnableUnauthorizedAccount');
  }); */

  it('addMoreUser: should revert if not owner', async function () {
    const socialContract = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const tree = getTree([owner, user2]);
    const addMoreUser = socialContract
      .connect(wallets[3])
      .addMoreUser(users, tree.getHexRoot() as Address);

    await expect(addMoreUser).to.be.rejectedWith('OwnableUnauthorizedAccount');
  });
});
