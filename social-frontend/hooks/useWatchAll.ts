import { useEffect, useState } from 'react';
import { getPublicClient } from '@wagmi/core';

import useRefresh from './useRefresh';
import { JSON_FILES, jsonFiles } from '../constants/contract';

/**
 * @notice Hook personnalisé pour surveiller les événements du contrat.
 * @dev Ce hook est utilisé pour surveiller les événements du contrat en utilisant
 * le hook `useContractEvent` de la bibliothèque "wagmi".  Il récupère les événements
 * du contrat à l'aide de la fonction `getEvents` et les met à jour dans l'état local.
 * @param {string} eventName - Le nom de l'événement à surveiller.
 * @param {any} abiJSON - L'ABI JSON du contrat.
 * @returns {CustomLogType[]} Les événements du contrat surveillés.
 */
export default function useWatchAll() {
  //const [unwatch, setUnwatch] = useState<any>();
  const [data, setData] = useState<any>();
  //  const contract = useConfigContractProject(contractName);
  const { isRefresh, refresh } = useRefresh();

  const client = getPublicClient();

  const unwatch = isRefresh
    ? client.watchContractEvent({
        abi: [
          ...jsonFiles[JSON_FILES.network].abi,
          ...jsonFiles[JSON_FILES.messenger].abi,
          ...jsonFiles[JSON_FILES.account].abi,
          ...jsonFiles[JSON_FILES.profile].abi,
        ],
        onLogs: (l) => {
          setData(l);
          refresh();
        },
      })
    : undefined;

  useEffect(() => {
    if (!isRefresh) {
      unwatch?.();
    }
  }, [isRefresh]);

  useEffect(() => {
    return () => {
      unwatch?.();
    };
  }, []);

  return data;
}
