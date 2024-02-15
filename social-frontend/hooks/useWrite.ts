import { useEffect, useState } from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import {
  ContractParams,
  CustomError,
  OnError,
  OnSuccess,
} from '../constants/type';
import useToasts from './useToasts';
import { getErrorMsg } from '../utils/contract';
import { JSON_FILES } from '../constants/contract';
import useConfigContractProject from './useConfigContractProject';

/**
 * @notice Gérer l'écriture de transactions sur le contrat.
 * @param {ContractParams} params - Paramètres de l'opération d'écriture sur le contrat.
 * @param {OnError} onError - Fonction appelée en cas d'erreur lors de l'opération d'écriture.
 * @param {OnSuccess} onSuccess - Fonction appelée en cas de succès lors de l'opération d'écriture.
 * @returns {Object} Objet contenant des informations sur l'état de l'opération d'écriture.
 *   - {boolean} isLoading - Indique si une opération d'écriture est en cours.
 *   - {boolean} isError - Indique s'il y a eu une erreur lors de l'opération d'écriture.
 *   - {boolean} isFetching - Indique si l'application est en cours de récupération des données.
 *   - {boolean} isSuccess - Indique si l'opération d'écriture s'est terminée avec succès.
 */
export default function useWrite(
  params: ContractParams,
  onError?: OnError,
  onSuccess?: OnSuccess,
  contractName?: JSON_FILES
) {
  const contract = useConfigContractProject(contractName);
  const { toastError } = useToasts();
  const [prepareParams, setPrepareParams] = useState<ContractParams>(params);

  // write transaction
  const prepare = usePrepareContractWrite(prepareParams);
  const writeContract = useContractWrite(prepare.config);

  useEffect(() => {
    setPrepareParams(
      params?.functionName ? { ...contract, ...params } : undefined
    );
  }, [params?.functionName, params?.args?.length, params?.enabled]);

  // waiting transaction
  const waitTransaction = useWaitForTransaction({
    hash: writeContract.data?.hash,
    onSuccess,
  });

  // manage all errors here
  const error = (waitTransaction.error ||
    writeContract.error ||
    prepare.error) as CustomError;

  const isError =
    waitTransaction.isError || writeContract.isError || prepare.isError;

  useEffect(() => {
    if (isError && Boolean(error)) {
      const content = getErrorMsg(error);
      onError?.(content);
      toastError(content);
      writeContract.reset();
      prepare.internal.remove();
      setPrepareParams(undefined);
    }
  }, [error, isError]);

  // on success
  useEffect(() => {
    if (prepare.isSuccess) {
      writeContract.write?.();
    }
  }, [prepare.isSuccess]);

  return {
    isLoading:
      waitTransaction.isLoading || writeContract.isLoading || prepare.isLoading,
    isError:
      waitTransaction.isError || writeContract.isError || prepare.isError,
    isFetching: waitTransaction.isFetching || prepare.isFetching,
    isSuccess: waitTransaction.isSuccess,
  };
}
