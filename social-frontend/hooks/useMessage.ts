import { useState } from 'react';
import { Address } from 'viem';

import useWrite from './useWrite';
import useToasts from './useToasts';
import useProof from './useProof';
import { ABIS } from '../constants/contract';
import { displayAdress } from '../utils/common';
import { cidToHex } from '../utils/contract';

export default function useMessage(_to: Address) {
  const proof = useProof();
  const [cid, setCid] = useState<Address | undefined>(undefined);
  const { toastSuccess } = useToasts();

  const onError = () => {
    setCid(undefined);
  };

  const onSuccess = () => {
    toastSuccess(`message sended to ${displayAdress(_to)} success`);
    setCid(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess,
    ABIS.messenger
  );

  const wrapperSetCid = (_cid: Address) => {
    const newCid = cidToHex(_cid) as Address;
    setCid(newCid);
    write({
      functionName: 'sendMessage',
      args: [newCid, _to, proof],
    });
  };

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setCid: wrapperSetCid,
  };
}
