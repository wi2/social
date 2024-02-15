import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { Address } from 'viem';
import useProof from './useProof';
import { JSON_FILES } from '../constants/contract';
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

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: 'sendMessage',
      args: [cid, _to, proof],
      enabled: cid !== undefined,
    },
    onError,
    onSuccess,
    JSON_FILES.messenger
  );

  const wrapperSetCid = (_cid: Address) => {
    setCid(cidToHex(_cid));
  };

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setCid: wrapperSetCid,
  };
}
