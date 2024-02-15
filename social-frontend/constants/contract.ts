import socialJson from '../../social-backend/artifacts/contracts/Social.sol/Social.json';
import socialAccountJson from '../../social-backend/artifacts/contracts/SocialAccount.sol/SocialAccount.json';
import socialNetworkJson from '../../social-backend/artifacts/contracts/SocialNetwork.sol/SocialNetwork.json';
import socialMessenger from '../../social-backend/artifacts/contracts/SocialNetWorkMessenger.sol/SocialNetWorkMessenger.json';
import socialProfile from '../../social-backend/artifacts/contracts/SocialProfile.sol/SocialProfile.json';

const addrContract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const socialConf = {
  abi: socialJson.abi,
  address: addrContract,
};

export enum JSON_FILES {
  social = 'social',
  account = 'account',
  network = 'network',
  messenger = 'messenger',
  profile = 'profile',
}

export const jsonFiles = {
  [JSON_FILES.social]: socialJson,
  [JSON_FILES.account]: socialAccountJson,
  [JSON_FILES.network]: socialNetworkJson,
  [JSON_FILES.messenger]: socialMessenger,
  [JSON_FILES.profile]: socialProfile,
};
