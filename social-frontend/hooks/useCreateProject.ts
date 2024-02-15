import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { CreateProjectType } from '../constants/type';
import { getTree } from '../utils/contract';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

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
  const enabled = Boolean(project?.name && project?.slug && uniqAddress.length);

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: 'create',
      args: [
        project?.name,
        project?.slug,
        uniqAddress,
        getTree(uniqAddress as Address[]).getHexRoot(),
      ],
      enabled,
    },
    onError,
    onSuccess
  );

  return {
    isLoading,
    isSuccess,
    isError,
    isFetching,
    setProject,
  };
}
