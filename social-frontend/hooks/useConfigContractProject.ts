import { useAccount } from 'wagmi';

import { JSON_FILES, jsonFiles, socialConf } from '../constants/contract';
import useGetProject from './useGetProject';

/**
 * @notice Helper pour la configuration des hook de wagmi
 * @param {JSON_FILES} contractName - nom du contrat pour la config.
 * @returns {Object} Objet de contrat configuré.
 */

export default function useConfigContractProject(contractName?: JSON_FILES) {
  const account = useAccount();
  const project = useGetProject();

  return {
    address: project.data?.[contractName || ''] || socialConf.address,
    abi: jsonFiles[contractName || JSON_FILES.social].abi,
    account: account.address,
  };
}
