import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import { useAccount } from 'wagmi';
import Icons from './Icons';
import Avatar from './Avatar';
import useContract from '../context/Contract';
import useGetProject from '../hooks/useGetProject';
import Textarea from './Textarea';
import { FormEvent, MouseEvent, useCallback, useState } from 'react';
import useAddUser from '../hooks/useAddUser';

export default function Board() {
  const [displayForm, setDisplayForm] = useState(false);
  const { address } = useAccount();
  const isConnected = useIsConnected();
  const { allLikes, allPins, follows, users } = useContract();
  const { data } = useGetProject();
  const { setAdresses } = useAddUser();

  const nbLikes = allLikes?.filter((like) => like?.args._me === address).length;
  const nbPins = allPins?.filter((pin) => pin?.args._me === address).length;
  const nbFollows = follows?.filter((flw) => flw?.args._me === address).length;
  const isAdmin = data.owner === address;

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAdresses(e.currentTarget.adresses.value);
      window.location.reload();
    },
    [setAdresses]
  );

  if (!isConnected) {
    return <Loader />;
  }

  return (
    <div className="relative flex flex-col gap-4 justify-center items-center">
      {isAdmin && (
        <>
          <div className="stats bg-neutral bg-opacity-80 text-neutral-content rounded-md">
            <div className="stat">
              <div className="stat-title text-accent">Total Users</div>
              <div className="stat-value">{users?.length || 0}</div>
              <div className="stat-actions">
                <button
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    setDisplayForm(!displayForm);
                  }}
                  className="btn btn-sm btn-accent text-accent-content"
                >
                  Add more users
                </button>
              </div>
            </div>
          </div>

          {displayForm && (
            <form
              className="flex flex-col w-full pt-4 pl-4 pb-4 bg-neutral text-neutral-content"
              onSubmit={onSubmit}
            >
              <h2 className="text-4xl font-bold">Add more users</h2>

              <div className="mr-4">
                <div className="divider lg:divider-vertical" />
              </div>
              <h2 className="text-1xl font-bold">Users already added</h2>
              <div className="grid grid-cols-2 gap-2">
                {users?.map((user) => (
                  <div key={user}>{user}</div>
                ))}
              </div>

              <div className="mr-4">
                <div className="divider lg:divider-vertical" />
              </div>

              <label>Add users</label>
              <div className="mr-4">
                <Textarea name="adresses" disabled={!isConnected}></Textarea>
              </div>

              <div className="mr-4">
                <div className="divider lg:divider-vertical" />
              </div>

              <div className="flex justify-end pr-4">
                <button className="btn" disabled={!isConnected}>
                  Add
                </button>
              </div>
            </form>
          )}
        </>
      )}
      <div className="stats shadow bg-opacity-60 rounded-md">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Icons icon="liked" />
          </div>
          <div className="stat-title">Total Likes</div>
          <div className="stat-value text-secondary">{nbLikes}</div>
          <div className="stat-desc text-secondary">All your likes</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Icons icon="pinned" />
          </div>
          <div className="stat-title">Total Pins</div>
          <div className="stat-value text-primary">{nbPins}</div>
          <div className="stat-desc text-primary">All your pins</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-primary">
            <Avatar name={address} />
          </div>
          <div className="stat-title">Total followers</div>
          <div className="stat-value text-accent">{nbFollows}</div>
          <div className="stat-desc text-accent">All the user you follow</div>
        </div>
      </div>
    </div>
  );
}
