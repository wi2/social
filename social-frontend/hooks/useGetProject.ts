import { useReadContract } from 'wagmi';
import { useRouter } from 'next/router';

import useConfigContract from './useConfigContract';
import useIsConnected from './useIsConnected';

export default function useGetProject() {
  const isConnected = useIsConnected();
  const { query } = useRouter();
  const contract = useConfigContract();

  return useReadContract({
    ...contract,
    functionName: 'getProject',
    args: [query._slug as string],
    query: {
      enabled: isConnected && Boolean(query._slug),
    },
  });
}
