import { ReactNode, useEffect, useState } from 'react';
import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import { useAccount, useSwitchChain } from 'wagmi';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NotConnected({ children }: { children?: ReactNode }) {
  const [ready, setready] = useState(false);
  const { query } = useRouter();
  const { isConnecting, chainId } = useAccount();
  const isConnected = useIsConnected();
  const { chains, switchChain } = useSwitchChain();

  useEffect(() => {
    setTimeout(() => setready(true), 500);
  }, []);

  if (isConnecting || !ready) {
    return <Loader />;
  }

  if (!isConnected) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl text-secondary font-bold">
              You are not Connected.
            </h1>
            <p className="py-6">Please connect your wallet</p>
            {query._slug && (
              <Link href="/" className="btn btn-accent">
                Back to homepage
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!chains.map((chain) => chain.id).includes(chainId as number)) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl text-secondary font-bold">
              You are not using &ldquo;{chains[0].name}&rdquo;
            </h1>
            <p className="py-6">
              Please switch to &ldquo;{chains[0].name}&rdquo; chain
            </p>
            <button
              className="btn btn-accent"
              onClick={() => switchChain({ chainId: chains[0].id })}
            >
              Switch to &ldquo;{chains[0].name}&rdquo;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
}
