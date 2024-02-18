import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { Address } from 'viem';
import useProof from './useProof';
import { JSON_FILES } from '../constants/contract';
import { displayAdress } from '../utils/common';

export default function useFollow(_userFollow: Address | undefined) {
  const proof = useProof();
  const [isFollow, setFollow] = useState<boolean | undefined>(undefined);
  const [userFollow, setUserFollow] = useState<Address | undefined>(
    _userFollow
  );
  const { toastSuccess } = useToasts();

  const onError = () => {
    setFollow(undefined);
    setUserFollow(undefined);
  };

  const onSuccess = () => {
    toastSuccess(
      `${isFollow ? 'Follow' : 'Unfollow'} ${displayAdress(userFollow)} success`
    );
    setFollow(undefined);
    setUserFollow(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: isFollow ? 'follow' : 'unfollow',
      args: [userFollow, proof],
      enabled: isFollow !== undefined,
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
    setFollow,
    setUserFollow: (user: Address, active: boolean) => {
      setUserFollow(user);
      setFollow(active);
    },
    userFollow,
  };
}
