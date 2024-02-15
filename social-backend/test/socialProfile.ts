import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SocialProfile } from '../typechain-types';
import { Signer } from 'ethers';
import { Address, Hex, keccak256 } from 'viem';
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

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  PROFILE_CREATED: 1,
  PROFILE_UPDATED: 2,
};

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

async function deployAndExecuteUntilStep(step = STEP.CONTRACT_DEPLOYED) {
  const accountContract = await deployAndExecuteAccountSocial();
  const wallets = await ethers.getSigners();
  const [owner, admin, user2, user3] = await getAccountAdresses();
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
  let owner: Address;
  let admin: Address;
  let notUser1: Address;
  let user2: Address;
  let user3: Address;
  let wallets: Signer[];
  let usersAdded: Address[];
  let proofUser2: any;

  beforeEach(async () => {
    wallets = await ethers.getSigners();

    [owner, admin, user2, user3, notUser1] = await getAccountAdresses();
    usersAdded = [user2, admin, user3];
    proofUser2 = getHexProof(usersAdded, user2);
  });

  it('should create profile', async () => {
    const SocialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    await expect(SocialProfile.connect(wallets[1]).createProfile(user2))
      .to.emit(SocialProfile, 'CreateProfile')
      .withArgs(user2);
  });

  it('should update pseudo and emit event', async () => {
    const SocialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    await expect(
      SocialProfile.connect(wallets[2]).updatePseudo('My pseudo', proofUser2)
    )
      .to.emit(SocialProfile, 'UpdatePseudo')
      .withArgs('My pseudo', user2);
  });

  it('should update status and emit event', async () => {
    const SocialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    await expect(
      SocialProfile.connect(wallets[2]).updateStatus(true, proofUser2)
    )
      .to.emit(SocialProfile, 'UpdateStatus')
      .withArgs(true, user2);
  });

  it('Should revert getCurrentCID if not user', async () => {
    const SocialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    await expect(
      SocialProfile.connect(wallets[4]).updatePseudo(
        'my pseudo',
        getHexProof(usersAdded, notUser1)
      )
    ).revertedWithCustomError(SocialProfile, 'OnlyUser');
  });

  it('should revert getCurrentCID  is not user registered', async () => {
    const SocialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    await SocialProfile.connect(wallets[2]).updatePseudo(
      'My pseudo',
      proofUser2
    );
    const myProfile = await SocialProfile.connect(wallets[2]).getMyProfile();
    assert.equal(myProfile.pseudo, 'My pseudo');
  });

  it('Should revert updateStatus is not user registered', async () => {
    const SocialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    await expect(
      SocialProfile.connect(wallets[4]).updateStatus(
        false,
        getHexProof(usersAdded, notUser1)
      )
    ).revertedWithCustomError(SocialProfile, 'OnlyUser');
  });

  it('should revert CreateProfile with NotAuthorize', async function () {
    const socialProfile = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const addService = socialProfile.connect(wallets[3]).createProfile(user2);
    await expect(addService).to.be.rejectedWith('OwnableUnauthorizedAccount');
  });
});
