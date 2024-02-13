import { useContractRead } from 'wagmi';
import useConfigContract from './useConfigContract';
import { useRouter } from 'next/router';

export default function useGetProject() {
  const { query } = useRouter();
  const contract = useConfigContract();

  return useContractRead({
    ...contract,
    functionName: 'getProject',
    args: [query._slug],
    enabled: Boolean(query._slug),
  }) as { data: any };
}
