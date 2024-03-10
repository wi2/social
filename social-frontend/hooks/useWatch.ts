import { useEffect, useState } from 'react';
import { useBlockNumber } from 'wagmi';
import { zeroAddress } from 'viem';

import { getEvents } from '../utils/contract';
import useGetProject from './useGetProject';
import useWatchAll from './useWatchAll';
import { ABIS } from '../constants/contract';
import { CustomLogType } from '../constants/type';

/**
 * @notice Hook personnalisé pour surveiller les événements du contrat.
 * @dev Ce hook est utilisé pour surveiller les événements du contrat en utilisant
 * le hook `useContractEvent` de la bibliothèque "wagmi".  Il récupère les événements
 * du contrat à l'aide de la fonction `getEvents` et les met à jour dans l'état local.
 * @returns {Log[]} Les événements du contrat surveillés.
 */
export default function useWatch() {
  const [logs, setLogs] = useState<CustomLogType[]>([]);
  const lastBlock = useBlockNumber();
  const data = useWatchAll();
  const project = useGetProject();

  const projectData = project.data || {
    [ABIS.account]: zeroAddress,
    [ABIS.messenger]: zeroAddress,
    [ABIS.profile]: zeroAddress,
    [ABIS.network]: zeroAddress,
  };

  const logFiltered = project.data
    ? [...logs, ...data].filter((item) => {
        return [
          parseInt(projectData?.[ABIS.account]),
          parseInt(projectData?.[ABIS.messenger]),
          parseInt(projectData?.[ABIS.profile]),
          parseInt(projectData?.[ABIS.network]),
        ].includes(parseInt(item?.address as string));
      })
    : [];

  useEffect(() => {
    if (project.data && lastBlock.data) {
      const addresses = [
        projectData?.[ABIS.account],
        projectData?.[ABIS.messenger],
        projectData?.[ABIS.profile],
        projectData?.[ABIS.network],
      ];
      getEvents<CustomLogType>(lastBlock.data, addresses, setLogs);
    }
  }, [project.data, lastBlock.data]);

  return logFiltered;
}
