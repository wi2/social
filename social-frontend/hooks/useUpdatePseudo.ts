import { useState } from 'react';
import useWrite from './useWrite';
import useToasts from './useToasts';
import { JSON_FILES } from '../constants/contract';
import useProof from './useProof';
import { useRouter } from 'next/router';

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

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: 'updatePseudo',
      args: [pseudo, proof],
      enabled: pseudo !== undefined,
    },
    onError,
    onSuccess,
    JSON_FILES.profile
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setPseudo,
  };
}
