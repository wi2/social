import { useAccount, useContractRead } from 'wagmi';
import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';
import { Address, isAddress } from 'viem';

export default function useGetArticle() {
  const { address } = useAccount();
  const contract = useConfigContractProject(JSON_FILES.network);

  return useContractRead({
    ...contract,
    functionName: 'getLastArticleFrom',
    args: [address],
    enabled: Boolean(address) && isAddress(address as Address),
  }) as { data: any };
}
