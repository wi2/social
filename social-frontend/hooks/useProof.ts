import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { getHexProof } from '../utils/contract';
import { CustomLogType, CustomLogUserArgsType } from '../constants/type';
import { useEffect, useState } from 'react';

export default function useProof(
  users: CustomLogType<CustomLogUserArgsType>[]
) {
  const { address } = useAccount();
  const [proof, setProof] = useState<Address[]>();

  const allUsers = users
    ?.filter((user) => user?.args._users)
    .map((user) => user?.args._users)
    .flat();

  useEffect(() => {
    const prf = getHexProof(allUsers as Address[], address);
    setProof(prf);
  }, [address, allUsers.length, setProof]);

  return proof;
}
