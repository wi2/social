import { useState } from 'react';

import useWrite from './useWrite';
import useToasts from './useToasts';
import { CreateProjectType } from '../constants/type';
import { getTree } from '../utils/contract';
import { Address } from 'viem';

export default function useCreateProject() {
  const [project, setProject] = useState<CreateProjectType | null>(); // use type { name, slug, services[], adresses[] }
  const { toastSuccess } = useToasts();

  const onError = () => {
    setProject(null);
  };
  const onSuccess = () => {
    setProject(null);
    toastSuccess(`create ${project} success`);
  };

  const allAdresses = project?.adresses?.split(',') || [];
  const enabled = Boolean(project?.name && project?.slug && allAdresses.length);

  const { isLoading, isSuccess, isFetching, isError } = useWrite(
    {
      functionName: 'create',
      args: [
        project?.name,
        project?.slug,
        allAdresses,
        getTree(allAdresses as Address[]).getHexRoot(),
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
