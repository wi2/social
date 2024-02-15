import { useAccount, useContractRead } from 'wagmi';

import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';
import useProof from './useProof';
import useContract from '../context/Contract';

/**
 * @notice Vérifie si l'utilisateur actuel est le propriétaire du contrat.
 * @returns {boolean} Indique si l'utilisateur est connecté et le propriétaire du contrat.
 */
export default function useIsUser() {
  const proof = useProof();
  const { users } = useContract();

  const contract = useConfigContractProject(JSON_FILES.account);
  const { address } = useAccount();

  return useContractRead({
    ...contract,
    functionName: 'isUser',
    args: [address, proof],
    enabled: Boolean(address) && Boolean(users?.length),
  });
}
