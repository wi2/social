import { useState } from 'react';
import { Address } from 'viem';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { ABIS } from '../constants/contract';
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

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess,
    ABIS.network
  );

  const wapperSetCid = (_cid: Address) => {
    if (_cid) {
      setCid(cidToHex(_cid));
      write({
        functionName: 'postComment',
        args: [ArticleCid, cidToHex(_cid) as Address, proof],
      });
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
