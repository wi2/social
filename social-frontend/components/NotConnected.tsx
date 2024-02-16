import { ReactNode } from 'react';
import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

export default function NotConnected({ children }: { children?: ReactNode }) {
  const { query } = useRouter();
  const { isConnecting } = useAccount();
  const isConnected = useIsConnected();

  if (isConnecting) {
    return <Loader />;
  }

  if (!isConnected) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl font-bold">You're not Connected.</h1>
            <p className="py-6">Please connect your wallet</p>
            {query._slug && (
              <a href="/" className="btn btn-primary">
                Back to homepage
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
}
