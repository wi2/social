import socialJson from '../artifacts/Social.json';
import socialAccountJson from '../artifacts/SocialAccount.json';
import socialNetworkJson from '../artifacts/SocialNetwork.json';
import socialMessenger from '../artifacts/SocialNetworkMessenger.json';
import socialProfile from '../artifacts/SocialProfile.json';

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
