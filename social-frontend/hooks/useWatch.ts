import { useEffect, useState } from 'react';
import { useBlockNumber } from 'wagmi';
import { Log } from 'viem';

import { getEvents } from '../utils/contract';
import useGetProject from './useGetProject';
import useWatchAll from './useWatchAll';

/**
 * @notice Hook personnalisé pour surveiller les événements du contrat.
 * @dev Ce hook est utilisé pour surveiller les événements du contrat en utilisant
 * le hook `useContractEvent` de la bibliothèque "wagmi".  Il récupère les événements
 * du contrat à l'aide de la fonction `getEvents` et les met à jour dans l'état local.
 * @returns {Log[]} Les événements du contrat surveillés.
 */
export default function useWatch() {
  const [logs, setLogs] = useState<Log[]>([]);
  const lastBlock = useBlockNumber();
  const data = useWatchAll();
  const project = useGetProject();

  const logFiltered = [...logs, ...data].filter((item) => {
    return [
      parseInt(project.data?.account),
      parseInt(project.data?.messenger),
      parseInt(project.data?.profile),
      parseInt(project.data?.network),
    ].includes(parseInt(item?.address as string));
  });

  useEffect(() => {
    if (project.data && lastBlock.data) {
      const addresses = [
        project.data?.account,
        project.data?.messenger,
        project.data?.profile,
        project.data?.network,
      ];
      getEvents<Log>(lastBlock.data, addresses, setLogs);
    }
  }, [project.data, lastBlock.data]);

  return logFiltered;
}
