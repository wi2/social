import { ReactNode } from 'react';
import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import Icons from './Icons';
import Avatar from './Avatar';
import useContract from '../context/Contract';

export default function Board() {
  const { address } = useAccount();
  const isConnected = useIsConnected();
  const { allLikes, allPins, follows } = useContract();

  if (!isConnected) {
    return <Loader />;
  }

  const nbLikes = allLikes?.filter((like) => like?.args._me === address).length;
  const nbPins = allPins?.filter((pin) => pin?.args._me === address).length;
  const nbFollows = follows?.filter((flw) => flw?.args._me === address).length;

  return (
    <div className="relative flex justify-center items-center">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Icons icon="liked" />
          </div>
          <div className="stat-title">Total Likes</div>
          <div className="stat-value text-primary">{nbLikes}</div>
          <div className="stat-desc">All your likes</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Icons icon="pinned" />
          </div>
          <div className="stat-title">Total Pins</div>
          <div className="stat-value text-secondary">{nbPins}</div>
          <div className="stat-desc">All your pins</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-primary">
            <Avatar name={address} />
          </div>
          <div className="stat-title">Total followers</div>
          <div className="stat-value">{nbFollows}</div>
          <div className="stat-desc text-primary">All the user you follow</div>
        </div>
      </div>
    </div>
  );
}
