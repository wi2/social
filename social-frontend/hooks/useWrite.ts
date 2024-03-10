import { useEffect } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import {
  ContractFunctionArgs,
  ContractFunctionName,
  AbiStateMutability,
} from 'viem';

import { AppAbiType, CustomError, OnError, OnSuccess } from '../constants/type';
import useToasts from './useToasts';
import { getErrorMsg } from '../utils/contract';
import { ABIS } from '../constants/contract';
import useConfigContractProject from './useConfigContractProject';

/**
 * @notice Gérer l'écriture de transactions sur le contrat.
 * @param {OnError} onError - Fonction appelée en cas d'erreur lors de l'opération d'écriture.
 * @param {OnSuccess} onSuccess - Fonction appelée en cas de succès lors de l'opération d'écriture.
 * @param {ABIS} contractName - nom du contrat pour selectionner la config.
 * @returns {Object} Objet contenant des informations sur l'état de l'opération d'écriture.
 *   - {boolean} isLoading - Indique si une opération d'écriture est en cours.
 *   - {boolean} isError - Indique s'il y a eu une erreur lors de l'opération d'écriture.
 *   - {boolean} isFetching - Indique si l'application est en cours de récupération des données.
 *   - {boolean} isSuccess - Indique si l'opération d'écriture s'est terminée avec succès.
 *   - {()=> void} write - Methode pour lancer la requete.
 */
export default function useWrite(
  onError?: OnError,
  onSuccess?: OnSuccess,
  contractName?: ABIS
) {
  const contract = useConfigContractProject(contractName);
  const { toastError } = useToasts();
  const writeContract = useWriteContract();

  // waiting transaction
  const waitTransaction = useWaitForTransactionReceipt({
    hash: writeContract.data,
    ...contract,
    query: { enabled: Boolean(writeContract.isSuccess) },
  });

  // manage all errors here
  const error = (waitTransaction.error || writeContract.error) as CustomError;
  const isError = waitTransaction.isError || writeContract.isError;

  useEffect(() => {
    if (isError && Boolean(error)) {
      writeContract.reset();
      const content = getErrorMsg(error);
      onError?.(content);
      toastError(content);
    }
  }, [error, isError]);

  useEffect(() => {
    if (waitTransaction.isSuccess) {
      writeContract.reset();
      onSuccess?.();
    }
  }, [waitTransaction.isSuccess, onSuccess]);

  const write = (params: {
    functionName: ContractFunctionName<AppAbiType, 'nonpayable'>;
    args?: ContractFunctionArgs<
      AppAbiType,
      AbiStateMutability,
      ContractFunctionName<AppAbiType, 'nonpayable'>
    >;
  }) => {
    writeContract.writeContract({
      ...contract,
      ...params,
    });
  };

  return {
    isLoading: waitTransaction.isLoading || writeContract.isPending,
    isError: waitTransaction.isError || writeContract.isError,
    isFetching: waitTransaction.isFetching,
    isSuccess: waitTransaction.isSuccess,
    write,
  };
}
