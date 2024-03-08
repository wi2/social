import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { getHexProof } from '../utils/contract';
import useContract from '../context/Contract';

export default function useProof() {
  const { users } = useContract();
  const { address } = useAccount();
  const [proof, setProof] = useState<Address[]>();

  const allUsers = users?.filter((user) => user);

  useEffect(() => {
    const prf = getHexProof(allUsers as Address[], address);
    setProof(prf);
  }, [address, allUsers?.length, setProof]);

  return proof;
}
