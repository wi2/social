import { ReactNode } from 'react';
import useIsUser from '../hooks/useIsUser';
import Input from './Input';
import useGetProfile from '../hooks/useGetProfile';

export default function Authorize({ children }: { children: ReactNode }) {
  const isUser = useIsUser();
  const myProfile = useGetProfile();

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

  if (!myProfile.data.pseudo) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl font-bold">Give us a name</h1>
            <form>
              <label>
                Veuillez fournir un pseudo, pour activer votre compte, merci!
              </label>
              <Input name="pseudo" placeholder="pseudo" />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
}
