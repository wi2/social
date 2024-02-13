import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

/**
 * @notice Vérifier si l'utilisateur est connecté à son compte.
 * @returns {boolean} Retourne si l'utilisateur est connecté.
 */
export default function useIsConnected() {
  const [isConnected, setConnected] = useState(false);
  const { status } = useAccount();

  useEffect(() => {
    setConnected(status === 'connected');
  }, [status]);

  return isConnected;
}
