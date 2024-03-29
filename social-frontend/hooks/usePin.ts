import { useState } from 'react';
import { Address } from 'viem';

import useWrite from './useWrite';
import useToasts from './useToasts';
import useProof from './useProof';
import { ABIS } from '../constants/contract';
import { displayAdress } from '../utils/common';

export default function usePin(_cid: Address) {
  const proof = useProof();
  const [pin, setPin] = useState<boolean | undefined>(undefined);
  const { toastSuccess } = useToasts();

  const onError = () => {
    setPin(undefined);
  };

  const onSuccess = () => {
    toastSuccess(`${pin ? 'Pin' : 'UnPin'} ${displayAdress(_cid)} success`);
    setPin(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess,
    ABIS.network
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setPin: (_pin: boolean) => {
      setPin(_pin);
      write({
        functionName: _pin ? 'pin' : 'unpin',
        args: [_cid, proof],
      });
    },
  };
}
