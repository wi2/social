import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import useGetProject from './useGetProject';
import { Address } from 'viem';
import useProof from './useProof';
import { CustomLogType, CustomLogUserArgsType } from '../constants/type';
import { JSON_FILES } from '../constants/contract';
import { displayAdress } from '../utils/common';

export default function useLike(
  users: CustomLogType<CustomLogUserArgsType>[] | undefined,
  _cid: Address
) {
  const proof = useProof(users || []);
  const project = useGetProject();
  const [like, setLike] = useState<boolean | undefined>(undefined);
  const { toastSuccess } = useToasts();

  const onError = () => {
    setLike(undefined);
  };

  const onSuccess = () => {
    toastSuccess(`${like ? 'Like' : 'Unlike'} ${displayAdress(_cid)} success`);
    setLike(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: like ? 'like' : 'unlike',
      args: [_cid, proof],
      enabled: like !== undefined,
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
    setLike,
  };
}
