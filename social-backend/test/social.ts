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

// Create and deploy a voting contract instance and play the scenario until the specified step
async function deployAndExecuteUntilStep() {
  const SocialFactory = await ethers.getContractFactory('Social');
  const socialContract = await SocialFactory.deploy();
  await socialContract.waitForDeployment();
  return socialContract;
}

describe('SocialAccount', function () {
  let wallets: Signer[];

  beforeEach(async function () {
    wallets = await ethers.getSigners();
  });

  it('create Social should emit event with args', async function () {
    const socialContract = await deployAndExecuteUntilStep();
    const users = await getAccountAdresses();
    const tree = getTree(users);

    await expect(
      socialContract
        .connect(wallets[1])
        .create('Simplon', 'simplon', users, tree.getHexRoot())
    )
      .to.emit(socialContract, 'Create')
      .withArgs('simplon', 'Simplon');
  });

  it('Should revert create if already exist', async function () {
    const socialContract = await deployAndExecuteUntilStep();
    const users = await getAccountAdresses();
    const tree = getTree(users);

    await socialContract
      .connect(wallets[1])
      .create('Simplon', 'simplon', users, tree.getHexRoot());

    await expect(
      socialContract
        .connect(wallets[1])
        .create('Simplon', 'simplon', users, tree.getHexRoot())
    ).revertedWithCustomError(socialContract, 'SlugNameAlreadyExist');
  });

  it('should return the good name of  the project with getProjectName', async function () {
    const socialContract = await deployAndExecuteUntilStep();
    const users = await getAccountAdresses();
    const tree = getTree(users);
    await socialContract
      .connect(wallets[1])
      .create('Simplon', 'simplon', users, tree.getHexRoot());
    const projectName = await socialContract
      .connect(wallets[4])
      .getProjectName('simplon');
    assert.equal(projectName, 'Simplon');
  });

  it('should return the good owner with getProject', async function () {
    const socialContract = await deployAndExecuteUntilStep();
    const users = await getAccountAdresses();
    const tree = getTree(users);
    await socialContract
      .connect(wallets[1])
      .create('Simplon', 'simplon', users, tree.getHexRoot());
    const project = await socialContract
      .connect(wallets[4])
      .getProject('simplon');
    assert.equal(project.owner, users[1]);
  });

  /*   it('addService should revert with InsufficientPayment', async function () {
    const socialContract = await deployAndExecuteUntilStep(STEP.CREATED);
    const addService = socialContract.write.addService([[2]], {
      value: parseGwei('999'),
      account: admin,
    });
    await expect(addService).to.be.rejectedWith('InsufficientPayment()');
  });
 */
});
