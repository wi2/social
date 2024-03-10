import { useState } from 'react';
import { Address } from 'viem';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { getTree } from '../utils/contract';
import { ABIS } from '../constants/contract';
import useContract from '../context/Contract';

export default function useAddUser() {
  const { users } = useContract();
  const [adresses, setAdresses] = useState<string | null>();
  const { toastSuccess } = useToasts();

  const onError = () => {
    setAdresses(null);
  };
  const onSuccess = () => {
    setAdresses(null);
    toastSuccess(`add users success`);
  };

  const allAdresses = adresses?.split(',') || [];
  const uniqAddress = allAdresses.filter(
    (item, index) => allAdresses.indexOf(item) === index
  ) as Address[];
  const usersAddress = users || [];
  const uniqAddressForMerkle = [...usersAddress, ...uniqAddress];

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess,
    ABIS.account
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setAdresses: (val: string) => {
      write({
        functionName: 'addMoreUser',
        args: [
          uniqAddress,
          getTree(uniqAddressForMerkle as Address[]).getHexRoot() as Address,
        ],
      });
      setAdresses(val);
    },
  };
}
