import { useAccount, useReadContract } from 'wagmi';
import { Address, isAddress } from 'viem';

import useConfigContract from './useConfigContract';

/**
 * @notice Vérifie si l'utilisateur actuel est le propriétaire du contrat.
 * @returns {boolean} Indique si l'utilisateur est connecté et le propriétaire du contrat.
 */
export default function useIsOwner(): boolean {
  const contract = useConfigContract();
  const { address } = useAccount();

  const { data } = useReadContract({
    ...contract,
    functionName: 'owner',
    query: {
      enabled: Boolean(address) && isAddress(address as Address),
    },
  });
  return Boolean(data) && data === address;
}
