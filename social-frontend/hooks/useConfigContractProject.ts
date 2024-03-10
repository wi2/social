import { useAccount } from 'wagmi';

import { ABIS, abis, socialConf } from '../constants/contract';
import useGetProject from './useGetProject';
import {
  socialAbi,
  socialAccountAbi,
  socialMessengerAbi,
  socialNetworkAbi,
  socialProfileAbi,
} from '../constants/abi';

/**
 * @notice Helper pour la configuration des hook de wagmi
 * @param {ABIS} contractName - nom du contrat pour la config.
 * @returns {Object} Objet de contrat configuré.
 */

export default function useConfigContractProject(contractName?: ABIS) {
  const account = useAccount();
  const project = useGetProject();

  type CUSTOM_ABIS =
    | ABIS.account
    | ABIS.messenger
    | ABIS.network
    | ABIS.profile;

  const name = contractName || ABIS.network;
  const address = project.data
    ? project.data[name as CUSTOM_ABIS]
    : socialConf.address;

  type tt =
    | typeof socialAccountAbi
    | typeof socialMessengerAbi
    | typeof socialNetworkAbi
    | typeof socialProfileAbi
    | typeof socialAbi;

  return {
    address,
    abi: abis[contractName || ABIS.social],
    account: account.address,
  };
}
