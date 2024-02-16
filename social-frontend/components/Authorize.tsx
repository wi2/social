import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import useIsUser from '../hooks/useIsUser';
import Input from './Input';
import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import useUpdatePseudo from '../hooks/useUpdatePseudo';
import { useAccount } from 'wagmi';
import useContract from '../context/Contract';
import NotConnected from './NotConnected';
import Link from 'next/link';

export default function Authorize({ children }: { children: ReactNode }) {
  const [isReady, setReady] = useState(false);
  const { address, isConnecting } = useAccount();
  const isConnected = useIsConnected();
  const isUser = useIsUser();
  const { setPseudo } = useUpdatePseudo();
  const { profiles } = useContract();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { pseudo } = e.currentTarget;
      setPseudo(pseudo.value);
    },
    [setPseudo]
  );

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 200);
  }, []);

  if (!isConnected && !isConnecting && isReady) {
    return <NotConnected />;
  }

  if (
    !isConnected ||
    isUser.isLoading ||
    isUser.isFetching ||
    !isUser.isSuccess ||
    !isReady
  ) {
    return <Loader />;
  }

  if (!isUser.data && isReady) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl font-bold">You are not Authorize.</h1>
            <p className="py-6">
              This account user is not authorize to access.
              <br />
              Are you sure to connect with the good account?
            </p>
            <Link href="/" className="btn btn-primary">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!profiles[`profile-${address}`] && isReady) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl font-bold">Give us your pseudo</h1>

            <form onSubmit={onSubmit}>
              <label className="flex p-2">
                Pleave save your pseudo to activate your account
              </label>
              <div className="flex flex-row">
                <Input name="pseudo" placeholder="pseudo" />
                <button className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
}
