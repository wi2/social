import { useAccount, useReadContract } from 'wagmi';
import { Address, isAddress } from 'viem';

import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';

export default function useGetProfile() {
  const { address } = useAccount();
  const contract = useConfigContractProject(JSON_FILES.profile);

  return useReadContract({
    ...contract,
    functionName: 'getMyProfile',
    query: {
      enabled: Boolean(address) && isAddress(address as Address),
    },
  }) as { data: any };
}
