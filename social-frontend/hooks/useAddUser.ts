import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { getTree } from '../utils/contract';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { JSON_FILES } from '../constants/contract';
import useContract from '../context/Contract';

export default function useAddUser() {
  const { address } = useAccount();
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
  );
  const usersAddress = users || [];
  const uniqAddressForMerkle = [...usersAddress, ...uniqAddress];

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: 'addMoreUser',
      args: [
        uniqAddress,
        getTree(uniqAddressForMerkle as Address[]).getHexRoot(),
      ],
      enabled: Boolean(allAdresses.length),
    },
    onError,
    onSuccess,
    JSON_FILES.account
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setAdresses,
  };
}
