import { useAccount, useReadContract } from 'wagmi';
import { Address, isAddress } from 'viem';

import useConfigContractProject from './useConfigContractProject';
import { ABIS } from '../constants/contract';

export default function useGetProfile() {
  const { address } = useAccount();
  const contract = useConfigContractProject(ABIS.profile);

  return useReadContract({
    ...contract,
    functionName: 'getMyProfile',
    query: {
      enabled: Boolean(address) && isAddress(address as Address),
    },
  });
}
