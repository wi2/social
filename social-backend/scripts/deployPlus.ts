import { ethers, network } from 'hardhat';
import fs from 'fs';
import bs58 from 'bs58';

import verify from '../utils/verify';
import { Address, Hex, keccak256 } from 'viem';
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

async function findWalletByAddess(addr: Address) {
  const wallets = await await ethers.getSigners();
  return wallets.find((item) => item.address === addr);
}

async function main() {
  const Social = await ethers.deployContract('Social', []);
  await Social.waitForDeployment();
  console.log(`Social deployed to ${Social.target}`);

  //
  const wallets = await ethers.getSigners();
  const [, admin, user2, cyril, ben, daniel] = await getAccountAdresses();
  const [, walletAdmin, walletUser2, cyrilWallet, benWallet, danielWallet] =
    await wallets;

  const usersAdded = [admin, user2, cyril, ben, daniel];
  console.log(usersAdded.length, 'users');
  console.log(usersAdded);

  const tree = getTree(usersAdded);

  await Social.connect(walletAdmin).create(
    'Alyra',
    'alyra',
    usersAdded,
    tree.getHexRoot()
  );

  // PROJECT CREATION
  console.log('\n\n-- PROJECT CREATION --');

  const project = await Social.connect(walletAdmin).getProject('alyra');
  console.log('Project created by the owner' + project.owner);
  console.log('account', project.account);
  console.log('network', project.network);
  console.log('networkMessenger', project.messenger);

  await ethers.getContractAt('SocialAccount', project.account);
  const networkContract = await ethers.getContractAt(
    'SocialNetWork',
    project.network
  );
  const messengerContract = await ethers.getContractAt(
    'SocialNetworkMessenger',
    project.messenger
  );

  // SCENARIO SOCIAL NETWORK
  console.log('\n\n-- SCENARIO SOCIAL NETWORK --');
  // get cids generate by ./pinata.js
  const articleCids = fs
    .readFileSync('scripts/files/cids.txt', 'utf8')
    .split(',');

  const userWallets = [cyrilWallet, benWallet, danielWallet];

  console.log(articleCids.length + ' articles (cid)\n');
  articleCids.forEach(async (_cid: string, index: number) => {
    const decodedFull = bs58.decode(_cid);
    const decoded = decodedFull.slice(2);
    console.log('cid' + index + ':', _cid);
    // add article
    await networkContract
      .connect(userWallets[index])
      .postArticle(
        decoded,
        getHexProof(usersAdded, userWallets[index].address)
      );
    console.log(
      `Article ${index + 1}(${_cid}) created by ${userWallets[index].address}`
    );
  });

  let decodedFull = bs58.decode(articleCids[1]);
  let decoded = decodedFull.slice(2);
  await networkContract
    .connect(cyrilWallet)
    .like(decoded, getHexProof(usersAdded, cyril));
  console.log(`Like Article ${articleCids[1]} by ${cyril}`);

  await networkContract
    .connect(cyrilWallet)
    .pin(decoded, getHexProof(usersAdded, cyril));
  console.log(`Like Article ${articleCids[1]} by ${cyril}`);

  decodedFull = bs58.decode(articleCids[2]);
  decoded = decodedFull.slice(2);
  await networkContract
    .connect(cyrilWallet)
    .like(decoded, getHexProof(usersAdded, cyrilWallet.address));
  console.log(`Like Article ${articleCids[2]} by ${cyril}`);

  // user 2 follows
  await networkContract
    .connect(cyrilWallet)
    .follow(ben, getHexProof(usersAdded, cyril));
  console.log(`Follow ${ben} by ${cyril}`);

  await networkContract
    .connect(cyrilWallet)
    .follow(daniel, getHexProof(usersAdded, cyril));
  console.log(`Follow ${daniel} by ${cyril}`);

  await networkContract
    .connect(benWallet)
    .follow(cyril, getHexProof(usersAdded, ben));
  console.log(`Follow ${cyril} by ${ben}`);

  // SCENARIO SOCIAL NETWORK
  console.log('\n\n-- SCENARIO Messenger --');

  //Cyril send first message
  const CID = bs58.decode('QmYLeuHcpFsAwrweF15cU6jkP9QPxFyuKJitooeuwfeLou');
  await messengerContract
    .connect(cyrilWallet)
    .sendMessage(CID.slice(2), ben, getHexProof(usersAdded, cyril));
  console.log('Cyril sent to Ben a message');

  //Ben send second message
  const CID2 = bs58.decode('QmUxmbjii7LY6V29rc4QGomWiSZdSvdnSp5h5tjNvNoRbo');
  await messengerContract
    .connect(benWallet)
    .sendMessage(CID2.slice(2), cyril, getHexProof(usersAdded, ben));
  console.log('Ben sent to Cyril a message');

  //Cyril send first message
  const CID3 = bs58
    .decode('QmPHisK9FH1Va58ENEMci7J6t2CZZaWWCp4fYbmndih2C4')
    .slice(2);
  await messengerContract
    .connect(cyrilWallet)
    .sendMessage(CID3, ben, getHexProof(usersAdded, cyril));
  console.log('Cyril sent to Ben a message');

  console.log(`\n-- END Messenger --\n`);

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
