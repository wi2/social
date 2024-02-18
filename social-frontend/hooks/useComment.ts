import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { Address } from 'viem';
import { JSON_FILES } from '../constants/contract';
import useProof from './useProof';
import { displayAdress } from '../utils/common';
import { cidToHex } from '../utils/contract';

export default function useComment(ArticleCid: Address) {
  const proof = useProof();
  const [cid, setCid] = useState<Address | undefined>(); // use type { name, slug, services[], adresses[] }
  const { toastSuccess } = useToasts();

  const onError = () => {
    setCid(undefined);
  };
  const onSuccess = () => {
    if (cid) toastSuccess(`create comment ${displayAdress(cid)} success`);
    setCid(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: 'postComment',
      args: [ArticleCid, cid, proof],
      enabled: cid !== undefined && ArticleCid !== undefined,
    },
    onError,
    onSuccess,
    JSON_FILES.network
  );

  const wapperSetCid = (_cid: Address) => {
    if (_cid) {
      setCid(cidToHex(_cid));
    }
  };

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setCid: wapperSetCid,
  };
}
