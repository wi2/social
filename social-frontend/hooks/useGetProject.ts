import { useContractRead } from 'wagmi';
import useConfigContract from './useConfigContract';
import { useRouter } from 'next/router';
import useIsConnected from './useIsConnected';

export default function useGetProject() {
  const isConnected = useIsConnected();
  const { query } = useRouter();
  const contract = useConfigContract();

  return useContractRead({
    ...contract,
    functionName: 'getProject',
    args: [query._slug],
    enabled: isConnected && Boolean(query._slug),
  }) as { data: any };
}
