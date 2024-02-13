import { useAccount, useContractRead } from 'wagmi';
import useConfigContract from './useConfigContract';
import { useRouter } from 'next/router';
import useConfigContractProject from './useConfigContractProject';
import { JSON_FILES } from '../constants/contract';

export default function useGetArticle() {
  const { address } = useAccount();
  const { query } = useRouter();
  const contract = useConfigContractProject(JSON_FILES.network);

  return useContractRead({
    ...contract,
    functionName: 'getLastArticleFrom',
    args: [address],
    enabled: Boolean(address),
  }) as { data: any };
}
