import { ReactNode } from 'react';
import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

  return <div className="relative">{children}</div>;
}
