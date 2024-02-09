import hre from 'hardhat';
import '@nomicfoundation/hardhat-chai-matchers';
import { expect } from 'chai';
import { parseGwei, keccak256, createTestClient, http } from 'viem';
import { hardhat } from 'viem/chains';
import MerkleTree from 'merkletreejs';

type hex = '0x${string}';

const testClient = createTestClient({
  chain: hardhat,
  mode: 'anvil',
  transport: http(),
});

const getAccountAdresses = async () => {
  const wallets = await hre.viem.getWalletClients();
  return wallets.map(({ account: { address } }) => address) as hex[];
};

function getTree(users: string[]) {
  const leaves = users.map((address) => keccak256(address as hex));
  return new MerkleTree(leaves, keccak256, { sort: true });
}

function getHexProof(users: hex[], user: string) {
  const tree = getTree(users);
  const leaf = keccak256(user as hex);
  return tree.getHexProof(leaf) as hex[];
}

// Steps for the test scenario
const STEP = {
  CONTRACT_DEPLOYED: 0,
  CREATED: 1,
  USER_ADDED: 2,
  SERVICE_ADDED: 3,
};

// Create and deploy a voting contract instance and play the scenario until the specified step
async function deployAndExecuteUntilStep(step = STEP.CONTRACT_DEPLOYED) {
  const [owner, admin, notUser1, user2, ...users] = await getAccountAdresses();
  const socialContract = await hre.viem.deployContract('SocialAccount', [
    owner,
    admin,
  ]);

  let usersAdded = [user2, admin];

  if (step >= STEP.CREATED) {
    const tree = getTree([admin, user2]);
    await socialContract.write.createSocial(
      [[1], [user2], tree.getHexRoot() as hex],
      { value: parseGwei('2000'), account: admin }
    );
  }
  if (step >= STEP.USER_ADDED) {
    usersAdded = [admin, user2, ...users];
    const tree = getTree(usersAdded);
    await socialContract.write.addMoreUser(
      [[user2], tree.getHexRoot() as hex],
      { account: admin }
    );
  }
  if (step >= STEP.SERVICE_ADDED) {
    await socialContract.write.addService([[2]], {
      value: parseGwei('1000'),
      account: admin,
    });
  }
  return {
    socialContract,
  };
}

describe('SocialAccount', function () {
  let owner: hex, admin: hex, notUser1: hex, user2: hex, users: hex[];

  beforeEach(async function () {
    [owner, admin, notUser1, user2, ...users] = await getAccountAdresses();
  });

  it('should return false if not admin', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );

    const isAdmin = await socialContract.read.isAdmin({ account: user2 });
    expect(isAdmin).to.be.false;
  });

  it('if create successful, isAdmin should return true', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.CREATED);

    const isAdmin = await socialContract.read.isAdmin({ account: admin });
    expect(isAdmin).to.be.true;
  });

  it('should revert NotAuthorize if not admin', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(
      STEP.CONTRACT_DEPLOYED
    );
    const tree = getTree([admin, user2]);

    const createSocial = socialContract.write.createSocial(
      [[1], [user2], tree.getHexRoot() as hex],
      { value: parseGwei('2000'), account: admin }
    );

    expect(createSocial).to.be.rejected;
  });

  it('isUser should return true', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.USER_ADDED);
    const proof = await getHexProof([admin, user2, ...users], user2);
    const isUser = await socialContract.read.isUser([user2, proof], {
      account: user2,
    });
    expect(isUser).to.be.true;
  });

  it('isUser should return false', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.USER_ADDED);
    const proof = await getHexProof([admin, user2, ...users], notUser1);
    const isUser = await socialContract.read.isUser([notUser1, proof]);
    expect(isUser).to.be.false;
  });

  it('isServiceActive should return true', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.CREATED);
    const isServiceActive = await socialContract.read.isServiceActive([1], {
      account: user2,
    });
    expect(isServiceActive).to.be.true;
  });

  it('isServiceActive should return false', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.CREATED);
    const isServiceActive = await socialContract.read.isServiceActive([2], {
      account: user2,
    });
    expect(isServiceActive).to.be.false;
  });

  it('isServiceActive should return true', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(
      STEP.SERVICE_ADDED
    );
    const isServiceActive = await socialContract.read.isServiceActive([2], {
      account: user2,
    });
    expect(isServiceActive).to.be.true;
  });

  it('addService should revert with InsufficientPayment', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.CREATED);
    const addService = socialContract.write.addService([[2]], {
      value: parseGwei('999'),
      account: admin,
    });
    await expect(addService).to.be.rejectedWith('InsufficientPayment()');
  });

  it('addService should revert with NotAuthorize', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.CREATED);
    const addService = socialContract.write.addService([[2]], {
      value: parseGwei('1000'),
      account: user2,
    });
    await expect(addService).to.be.rejectedWith('NotAuthorize()');
  });

  it('addMoreUser: should revert if not admin', async function () {
    const { socialContract } = await deployAndExecuteUntilStep(STEP.CREATED);
    const tree = getTree([admin, user2]);

    const prm = [users, tree.getHexRoot() as hex] as any;
    const addMoreUser = socialContract.write.addMoreUser(prm, {
      account: user2,
    });

    await expect(addMoreUser).to.be.rejectedWith('NotAuthorize');
  });
});
