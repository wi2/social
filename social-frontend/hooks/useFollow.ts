import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { Address } from 'viem';
import useProof from './useProof';
import { CustomLogType, CustomLogUserArgsType } from '../constants/type';
import { JSON_FILES } from '../constants/contract';
import { displayAdress } from '../utils/common';

export default function useFollow(
  users: CustomLogType<CustomLogUserArgsType>[] | undefined,
  _userFollow: Address | undefined
) {
  const proof = useProof(users || []);
  const [isFollow, setFollow] = useState<boolean | undefined>(undefined);
  const { toastSuccess } = useToasts();

  const onError = () => {
    setFollow(undefined);
  };

  const onSuccess = () => {
    toastSuccess(
      `${isFollow ? 'Follow' : 'Unfollow'} ${displayAdress(
        _userFollow
      )} success`
    );
    setFollow(undefined);
  };

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: isFollow ? 'follow' : 'unfollow',
      args: [_userFollow, proof],
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
  };
}
