import { ethers } from 'hardhat';
import { Hex, keccak256 } from 'viem';
import MerkleTree from 'merkletreejs';

export const getAccountAdresses = async () => {
  const wallets = await ethers.getSigners();
  return wallets.map(({ address }) => address as Hex);
};

export function getTree(users: string[]) {
  const leaves = users.map((address) => keccak256(address as Hex));
  return new MerkleTree(leaves, keccak256, { sort: true });
}

export function getHexProof(users: Hex[], user: string) {
  const tree = getTree(users);
  const leaf = keccak256(user as Hex);
  return tree.getHexProof(leaf) as Hex[];
}
