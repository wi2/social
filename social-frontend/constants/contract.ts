import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, polygonMumbai } from 'wagmi/chains';

import {
  socialAbi,
  socialAccountAbi,
  socialProfileAbi,
  socialMessengerAbi,
  socialNetworkAbi,
} from './abi';

const addrContract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const socialConf = {
  abi: socialAbi,
  address: addrContract,
};

export enum ABIS {
  social = 'social',
  account = 'account',
  network = 'network',
  messenger = 'messenger',
  profile = 'profile',
}

export const abis = {
  [ABIS.social]: socialAbi,
  [ABIS.account]: socialAccountAbi,
  [ABIS.network]: socialNetworkAbi,
  [ABIS.messenger]: socialMessengerAbi,
  [ABIS.profile]: socialProfileAbi,
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
  ...abis[ABIS.account],
  ...abis[ABIS.profile],
  ...abis[ABIS.messenger],
  ...abis[ABIS.network],
];

export const abiEventJSON = abiJSON.filter((item) => item?.type === 'event');
