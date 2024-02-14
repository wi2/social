import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { getHexProof } from '../utils/contract';
import { useEffect, useState } from 'react';
import useContract from '../context/Contract';

export default function useProof() {
  const { users } = useContract();
  const { address } = useAccount();
  const [proof, setProof] = useState<Address[]>();

  const allUsers = users
    ?.filter((user) => user?.args._users)
    .map((user) => user?.args._users)
    .flat();

  useEffect(() => {
    const prf = getHexProof(allUsers as Address[], address);
    setProof(prf);
  }, [address, allUsers?.length, setProof]);

  return proof;
}
