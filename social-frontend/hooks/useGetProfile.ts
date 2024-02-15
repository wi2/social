import { useAccount, useContractRead } from 'wagmi';
import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';

export default function useGetProfile() {
  const { address } = useAccount();
  const contract = useConfigContractProject(JSON_FILES.profile);

  return useContractRead({
    ...contract,
    functionName: 'getMyProfile',
    args: [],
    enabled: Boolean(address),
  }) as { data: any };
}
