import { useState } from 'react';
import { Address } from 'viem';

import useWrite from './useWrite';
import useToasts from './useToasts';
import useProof from './useProof';
import { JSON_FILES } from '../constants/contract';
import { displayAdress } from '../utils/common';

export default function useLike(_cid: Address) {
  const proof = useProof();
  const [like, setLike] = useState<boolean | undefined>(undefined);
  const { toastSuccess } = useToasts();

  const onError = () => {
    setLike(undefined);
  };

  const onSuccess = () => {
    toastSuccess(`${like ? 'Like' : 'Unlike'} ${displayAdress(_cid)} success`);
    setLike(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess,
    JSON_FILES.network
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setLike: (_like: boolean) => {
      setLike(_like);
      write({
        functionName: _like ? 'like' : 'unlike',
        args: [_cid, proof],
      });
    },
  };
}
