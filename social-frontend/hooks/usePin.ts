import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import useGetProject from './useGetProject';
import { Address } from 'viem';
import useProof from './useProof';
import { CustomLogType, CustomLogUserArgsType } from '../constants/type';
import { JSON_FILES } from '../constants/contract';
import { displayAdress } from '../utils/common';

export default function usePin(
  users: CustomLogType<CustomLogUserArgsType>[] | undefined,
  _cid: Address
) {
  const proof = useProof(users || []);
  const project = useGetProject();
  const [pin, setPin] = useState<boolean | undefined>(undefined);
  const { toastSuccess } = useToasts();

  const onError = () => {
    setPin(undefined);
  };

  const onSuccess = () => {
    toastSuccess(`${pin ? 'Pin' : 'UnPin'} ${displayAdress(_cid)} success`);
    setPin(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: pin ? 'pin' : 'unpin',
      args: [_cid, proof],
      enabled: pin !== undefined,
    },
    onError,
    onSuccess,
    JSON_FILES.network
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setPin,
  };
}
