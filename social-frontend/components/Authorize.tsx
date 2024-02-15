import { ReactNode } from 'react';
import useIsUser from '../hooks/useIsUser';

export default function Authorize({ children }: { children: ReactNode }) {
  const isUser = useIsUser();

  if (!isUser.data) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl font-bold">You're not Authorize.</h1>
            <p className="py-6">
              This account user is not authorize to access to Alyra Are you sure
              to connect with the good account
            </p>
            <a href="/" className="btn btn-primary">
              Back to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
}
