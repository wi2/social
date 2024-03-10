import { useAccount, useReadContract } from 'wagmi';
import { Address, isAddress, zeroAddress } from 'viem';

import useConfigContractProject from './useConfigContractProject';
import { ABIS } from '../constants/contract';
import useProof from './useProof';
import useContract from '../context/Contract';

/**
 * @notice Vérifie si l'utilisateur actuel est le propriétaire du contrat.
 * @returns {boolean} Indique si l'utilisateur est connecté et le propriétaire du contrat.
 */
export default function useIsUser() {
  const proof = useProof();
  const { users } = useContract();

  const contract = useConfigContractProject(ABIS.account);
  const { address } = useAccount();

  return useReadContract({
    ...contract,
    functionName: 'isUser',
    args: [address || zeroAddress, proof || []],
    query: {
      enabled: isAddress(address as Address) && (users || []).length > 0,
    },
  });
}
