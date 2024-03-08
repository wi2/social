import { useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { CreateProjectType } from '../constants/type';
import { getTree } from '../utils/contract';

export default function useCreateProject() {
  const { address } = useAccount();
  const [project, setProject] = useState<CreateProjectType | null>(); // use type { name, slug, services[], adresses[] }
  const { toastSuccess } = useToasts();

  const onError = () => {
    setProject(null);
  };
  const onSuccess = () => {
    setProject(null);
    toastSuccess(`create ${project?.name} success`);
    setTimeout(() => {
      window.location.href = '/project?_slug=' + project?.slug;
    }, 500);
  };

  const allAdresses = project?.adresses?.split(',') || [];
  allAdresses.push(address as string);
  const uniqAddress = allAdresses.filter(
    (item, index) => allAdresses.indexOf(item) === index
  );

  const { isLoading, isSuccess, isFetching, isError, write } = useWrite(
    onError,
    onSuccess
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setProject: (_project: CreateProjectType) => {
      setProject(_project);
      write({
        functionName: 'create',
        args: [
          _project?.name,
          _project?.slug,
          uniqAddress,
          getTree(uniqAddress as Address[]).getHexRoot(),
        ],
      });
    },
  };
}
