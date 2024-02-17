import socialJson from '../json/Social.json';
import socialAccountJson from '../json/SocialAccount.json';
import socialNetworkJson from '../json/SocialNetwork.json';
import socialMessenger from '../json/SocialNetWorkMessenger.json';
import socialProfile from '../json/SocialProfile.json';

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
