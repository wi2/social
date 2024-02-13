import { useAccount } from 'wagmi';

import { socialConf } from '../constants/contract';

/**
 * @notice Helper pour la configuration des hook de wagmi
 * @returns {Object} Objet de contrat configuré.
 */
export default function useConfigContract() {
  const account = useAccount();

  return {
    ...socialConf,
    cacheOnBlock: true,
    cacheTime: 2000,
    staleTime: 2000,
    account: account.address,
  };
}
