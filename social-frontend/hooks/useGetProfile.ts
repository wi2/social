import { useAccount, useContractRead } from 'wagmi';
import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';
import { Address, isAddress } from 'viem';

export default function useGetProfile() {
  const { address } = useAccount();
  const contract = useConfigContractProject(JSON_FILES.profile);
  console.log(address);
  return useContractRead({
    ...contract,
    functionName: 'getMyProfile',
    enabled: Boolean(address) && isAddress(address as Address),
  }) as { data: any };
}
