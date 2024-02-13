import { ethers, network } from 'hardhat';
const fs = require('fs');
const bs58 = require('bs58');

import verify from '../utils/verify';
import { Hex, keccak256, toBytes, toHex } from 'viem';
import MerkleTree from 'merkletreejs';

const getAccountAdresses = async () => {
  const wallets = await ethers.getSigners();
  return wallets.map(({ address }) => address as Hex);
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

async function main() {
  const Social = await ethers.deployContract('Social', []);
  await Social.waitForDeployment();
  console.log(`Social deployed to ${Social.target}`);

  //
  const wallets = await ethers.getSigners();
  const [owner, admin, notUser1, user2, user3, ...users] =
    await getAccountAdresses();
  const [
    walletOwner,
    walletAdmin,
    walletNotUser1,
    walletUser2,
    walletUser3,
    ...walletUsers
  ] = await wallets;

  const usersAdded = [admin, user2, user3, ...users].slice(0, 10);
  console.log(usersAdded.length, 'users');
  console.log(usersAdded);

  const tree = getTree(usersAdded);

  await Social.connect(walletAdmin).create(
    'Alyra',
    'alyra',
    usersAdded,
    tree.getHexRoot()
  );

  const project = await Social.connect(walletAdmin).getProject('alyra');
  console.log('Project created by the owner' + project.owner);
  console.log('account', project.account);
  console.log('network', project.network);
  console.log('networkMessenger', project.messenger);

  const accountContract = await ethers.getContractAt(
    'SocialAccount',
    project.account
  );
  const networkContract = await ethers.getContractAt(
    'SocialNetWork',
    project.network
  );
  const messengerContract = await ethers.getContractAt(
    'SocialNetWorkMessenger',
    project.messenger
  );

  // articles, likes and pins
  const articleCids = fs
    .readFileSync('scripts/files/cids.txt', 'utf8')
    .split(',');

  console.log(articleCids.length);
  articleCids.forEach(async (_cid: string, index: number) => {
    const decodedFull = bs58.decode(_cid);
    const decoded = decodedFull.slice(2);
    console.log('>>', _cid);
    // add article
    await networkContract
      .connect(wallets[index + 3])
      .postArticle(
        decoded,
        getHexProof(usersAdded, wallets[index + 3].address)
      );

    await networkContract
      .connect(wallets[index + 4])
      .like(decoded, getHexProof(usersAdded, wallets[index + 4].address));

    if (index === 2 || index === 3) {
      await networkContract
        .connect(wallets[index + 4])
        .unlike(decoded, getHexProof(usersAdded, wallets[index + 4].address));
    }
    if (index === 2) {
      await networkContract
        .connect(wallets[index + 4])
        .like(decoded, getHexProof(usersAdded, wallets[index + 4].address));
    }

    if (index === 0) {
      await networkContract
        .connect(wallets[index + 3])
        .pin(decoded, getHexProof(usersAdded, wallets[index + 3].address));
    }
  });
  console.log('article, likes and pins added');

  // user 2 follows
  await networkContract
    .connect(walletUser2)
    .follow(user3, getHexProof(usersAdded, user2));
  await networkContract
    .connect(walletUser2)
    .follow(users[5], getHexProof(usersAdded, user2));
  await networkContract
    .connect(walletUser2)
    .unfollow(user3, getHexProof(usersAdded, user2));
  await networkContract
    .connect(walletUser2)
    .follow(users[6], getHexProof(usersAdded, user2));
  await networkContract
    .connect(walletUser2)
    .follow(user3, getHexProof(usersAdded, user2));

  // user 3 follows
  await networkContract
    .connect(walletUser3)
    .follow(users[6], getHexProof(usersAdded, user3));
  await networkContract
    .connect(walletUser3)
    .follow(users[5], getHexProof(usersAdded, user3));

  console.log('follows added');

  // eventual verification
  if (!network.name.includes('localhost') && process.env.POLYGONSCAN_API_KEY) {
    await Social.deploymentTransaction()?.wait(
      network.name.includes('localhost') ? 1 : 6
    );
    console.log('Verifying...');
    await verify(Social.target, []);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});