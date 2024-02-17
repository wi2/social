import { useAccount, useContractRead } from 'wagmi';

import useConfigContract from './useConfigContract';
import { Address, isAddress } from 'viem';

/**
 * @notice Vérifie si l'utilisateur actuel est le propriétaire du contrat.
 * @returns {boolean} Indique si l'utilisateur est connecté et le propriétaire du contrat.
 */
export default function useIsOwner(): boolean {
  const contract = useConfigContract();
  const { address } = useAccount();

  const { data } = useContractRead({
    ...contract,
    functionName: 'owner',
    enabled: Boolean(address) && isAddress(address as Address),
  });
  return Boolean(data) && data === address;
}
