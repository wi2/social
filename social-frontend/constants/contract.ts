import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, polygonMumbai } from 'wagmi/chains';

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

const projectId = process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID as string;

const mumbai = {
  ...polygonMumbai,
  rpcUrls: {
    ...polygonMumbai.rpcUrls,
    default: {
      ...polygonMumbai.rpcUrls.default,
      http: [
        `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
      ],
    },
  },
};

export const RANGE_BLOCK = BigInt(30000000);

export const wagmiConfig = getDefaultConfig({
  appName: 'dsnMaker',
  projectId,
  chains:
    process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [mumbai] : [hardhat],
  ssr: true,
});

const abiJSON = [
  ...jsonFiles[JSON_FILES.account].abi,
  ...jsonFiles[JSON_FILES.profile].abi,
  ...jsonFiles[JSON_FILES.messenger].abi,
  ...jsonFiles[JSON_FILES.network].abi,
];

export const abiEventJSON = abiJSON.filter((item) => item?.type === 'event');
