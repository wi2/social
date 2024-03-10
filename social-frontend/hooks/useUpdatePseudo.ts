import { useState } from 'react';
import { useRouter } from 'next/router';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { ABIS } from '../constants/contract';
import useProof from './useProof';

export default function useUpdatePseudo() {
  const { query } = useRouter();
  const proof = useProof();
  const [pseudo, setPseudo] = useState<string | undefined>(); // use type { name, slug, services[], adresses[] }
  const { toastSuccess } = useToasts();

  const onError = () => {
    setPseudo(undefined);
  };
  const onSuccess = () => {
    if (pseudo) toastSuccess(`create ${pseudo} success`);
    setPseudo(undefined);
    window.location.href = `/project?_slug=${query._slug}`;
  };

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess,
    ABIS.profile
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setPseudo: (_pseudo: string) => {
      write({
        functionName: 'updatePseudo',
        args: [_pseudo, proof],
      });
    },
  };
}
