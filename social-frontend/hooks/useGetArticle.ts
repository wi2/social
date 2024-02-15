import { useAccount, useContractRead } from 'wagmi';
import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';

export default function useGetArticle() {
  const { address } = useAccount();
  const contract = useConfigContractProject(JSON_FILES.network);

  return useContractRead({
    ...contract,
    functionName: 'getLastArticleFrom',
    args: [address],
    enabled: Boolean(address),
  }) as { data: any };
}
