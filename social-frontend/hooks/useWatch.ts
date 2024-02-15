import { useEffect, useState } from 'react';
import { getPublicClient } from '@wagmi/core';

import { CustomLogType } from '../constants/type';
import { getEvents } from '../utils/contract';
import useGetProject from './useGetProject';

/**
 * @notice Hook personnalisé pour surveiller les événements du contrat.
 * @dev Ce hook est utilisé pour surveiller les événements du contrat en utilisant
 * le hook `useContractEvent` de la bibliothèque "wagmi".  Il récupère les événements
 * du contrat à l'aide de la fonction `getEvents` et les met à jour dans l'état local.
 * @param {any} abiJSON - L'ABI JSON du contrat.
 * @returns {CustomLogType[]} Les événements du contrat surveillés.
 */
export default function useWatch<CustomLogArgsType>(abiJSON: any) {
  const [logs, setLogs] = useState<CustomLogType<CustomLogArgsType>[]>([]);
  const project = useGetProject();

  const client = getPublicClient();

  const logFiltered = logs.filter((item) => {
    return [
      parseInt(project.data?.account),
      parseInt(project.data?.messenger),
      parseInt(project.data?.profile),
      parseInt(project.data?.network),
    ].includes(parseInt(item?.address as string));
  });

  useEffect(() => {
    if (abiJSON) {
      getEvents<CustomLogArgsType>(client, abiJSON, setLogs);
    }
  }, [JSON.stringify(abiJSON)]);

  return logFiltered;
}
