import { useEffect, useState } from 'react';
import { watchContractEvent } from '@wagmi/core';
import { Log } from 'viem';
import { signal, effect } from '@preact/signals-core';

import { abiEventJSON, wagmiConfig } from '../constants/contract';

/**
 * @notice Hook personnalisé pour surveiller les événements du contrat.
 * @dev Ce hook est utilisé pour surveiller les événements du contrat en utilisant
 * le hook `useContractEvent` de la bibliothèque "wagmi".  Il récupère les événements
 * du contrat à l'aide de la fonction `getEvents` et les met à jour dans l'état local.
 * @returns {CustomLogType[]} Les événements du contrat surveillés.
 */
export default function useWatchAll() {
  const [historic, setHistoric] = useState<Log[]>([]);
  const [data, setData] = useState<Log[]>([]);
  const logs = signal<Log[]>([]);

  effect(() => {
    if (logs.value.length) {
      setData(logs.value);
    }
  });

  useEffect(() => {
    setHistoric([...historic, ...data]);
  }, [data, setHistoric]);

  useEffect(() => {
    const unwatch = watchContractEvent(wagmiConfig, {
      abi: abiEventJSON,
      onLogs: (l) => {
        logs.value = l;
      },
    });
    return () => {
      unwatch?.();
    };
  }, []);

  return historic as any;
}
