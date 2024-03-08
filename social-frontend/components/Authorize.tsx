import { FormEvent, ReactNode, useCallback } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

import Input from './Input';
import Loader from './Loader';
import NotConnected from './NotConnected';
import useIsUser from '../hooks/useIsUser';
import useUpdatePseudo from '../hooks/useUpdatePseudo';
import useContract from '../context/Contract';

export default function Authorize({ children }: { children: ReactNode }) {
  const { address, isConnecting } = useAccount();
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

  if (isConnecting || isUser.isLoading) {
    return <Loader />;
  }

  if (!isUser.data) {
    return (
      <NotConnected>
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
      </NotConnected>
    );
  }
  if (!profiles[`profile-${address}`]) {
    return (
      <NotConnected>
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
      </NotConnected>
    );
  }

  return (
    <NotConnected>
      <div className="relative">{children}</div>
    </NotConnected>
  );
}
