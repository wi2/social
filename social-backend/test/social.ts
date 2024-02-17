import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { Signer } from 'ethers';
import { getAccountAdresses, getTree } from '../utils/common';

// Create and deploy a voting contract instance and play the scenario until the specified step
async function deployAndExecuteUntilStep() {
  const SocialFactory = await ethers.getContractFactory('Social');
  const socialContract = await SocialFactory.deploy();
  await socialContract.waitForDeployment();
  return socialContract;
}

describe('Social Contract', function () {
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
});
