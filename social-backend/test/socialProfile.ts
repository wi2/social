import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialProfile } from '../typechain-types';
import { Signer } from 'ethers';
import { Hex } from 'viem';
import { getAccountAdresses, getHexProof, getTree } from '../utils/common';

async function deployAndExecuteAccountSocial() {
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

async function deployAndExecuteUntilStep() {
  const accountContract = await deployAndExecuteAccountSocial();
  const [, admin] = await getAccountAdresses();
  const SocialProfileFactory = await ethers.getContractFactory('SocialProfile');
  const accountContractAddress = await accountContract.getAddress();
  const SocialProfile = (await SocialProfileFactory.deploy(
    admin,
    accountContractAddress
  )) as SocialProfile;
  await SocialProfile.waitForDeployment();

  return SocialProfile;
}

describe('SocialProfile Contract', () => {
  let owner: Hex;
  let admin: Hex;
  let notUser1: Hex;
  let user2: Hex;
  let user3: Hex;
  let wallets: Signer[];
  let usersAdded: Hex[];
  let proofUser2: any;

  beforeEach(async () => {
    wallets = await ethers.getSigners();

    [owner, admin, user2, user3, notUser1] = await getAccountAdresses();
    usersAdded = [user2, admin, user3];
    proofUser2 = getHexProof(usersAdded, user2);
  });

  it('should create profile', async () => {
    const SocialProfile = await deployAndExecuteUntilStep();
    await expect(SocialProfile.connect(wallets[1]).createProfile(user2, 'Tom'))
      .to.emit(SocialProfile, 'CreateProfile')
      .withArgs(user2);
  });

  it('should update pseudo and emit event', async () => {
    const SocialProfile = await deployAndExecuteUntilStep();
    await expect(
      SocialProfile.connect(wallets[2]).updatePseudo('My pseudo', proofUser2)
    )
      .to.emit(SocialProfile, 'UpdatePseudo')
      .withArgs('My pseudo', user2);
  });

  it('should update status and emit event', async () => {
    const SocialProfile = await deployAndExecuteUntilStep();
    await expect(
      SocialProfile.connect(wallets[2]).updateStatus(true, proofUser2)
    )
      .to.emit(SocialProfile, 'UpdateStatus')
      .withArgs(true, user2);
  });

  it('Should revert getCurrentCID if not user', async () => {
    const SocialProfile = await deployAndExecuteUntilStep();
    await expect(
      SocialProfile.connect(wallets[4]).updatePseudo(
        'my pseudo',
        getHexProof(usersAdded, notUser1)
      )
    ).revertedWithCustomError(SocialProfile, 'OnlyUser');
  });

  it('should revert getCurrentCID  is not user registered', async () => {
    const SocialProfile = await deployAndExecuteUntilStep();
    await SocialProfile.connect(wallets[2]).updatePseudo(
      'My pseudo',
      proofUser2
    );
    const myProfile = await SocialProfile.connect(wallets[2]).getMyProfile();
    assert.equal(myProfile.pseudo, 'My pseudo');
  });

  it('Should revert updateStatus is not user registered', async () => {
    const SocialProfile = await deployAndExecuteUntilStep();
    await expect(
      SocialProfile.connect(wallets[4]).updateStatus(
        false,
        getHexProof(usersAdded, notUser1)
      )
    ).revertedWithCustomError(SocialProfile, 'OnlyUser');
  });

  it('should revert CreateProfile with NotAuthorize', async function () {
    const socialProfile = await deployAndExecuteUntilStep();
    const addService = socialProfile
      .connect(wallets[3])
      .createProfile(user2, 'Tom');
    await expect(addService).to.be.rejectedWith('OwnableUnauthorizedAccount');
  });
});
