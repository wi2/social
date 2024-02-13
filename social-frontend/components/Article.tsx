import Icons from './Icons';
import Swap from './Swap';
import { ipfsGet } from '../utils/ipfs';
import { useCallback, useEffect, useState } from 'react';
import { ArticleType } from '../constants/type';
import { dateFormat } from '../utils/common';
import Loader from './Loader';
import useContract from '../context/Contract';
import useLike from '../hooks/useLike';
import usePin from '../hooks/usePin';
import useFollow from '../hooks/useFollow';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export default function Article({ cid }: { cid: any }) {
  const { address } = useAccount();
  const [article, setArticle] = useState<ArticleType>();
  const { likes, pins, follows, users } = useContract();
  const { setLike, isLoading: isLoadingLike } = useLike(users, cid);
  const { setPin, isLoading: isLoadingPin } = usePin(users, cid);
  const { setFollow, isLoading: isLoadingFollow } = useFollow(
    users,
    article?.author.address as Address
  );

  const isLiked = likes?.some((like) => like?.args._cid === cid) || false;
  const isPinned = pins?.some((pin) => pin?.args._cid === cid) || false;
  const isFollow =
    follows?.some((flw) => flw?.args._userFollow === article?.author.address) ||
    false;

  const handleFollow = useCallback(() => {
    setFollow(!isFollow);
  }, [isFollow]);

  const handleLike = useCallback(() => {
    setLike(!isLiked);
  }, [isLiked]);

  const handlePin = useCallback(() => {
    setPin(!isPinned);
  }, [isPinned, setPin]);

  useEffect(() => {
    async function main() {
      const getContent = await ipfsGet(cid);
      setArticle(getContent);
    }
    main();
  }, [cid, setArticle]);

  return (
    <div className="card card-compact bg-base-100 shadow-xl rounded mr-4 ml-4">
      <div className="card-body">
        <h2 className="card-title">
          <span className="flex-1">
            {article?.title || <Loader />}{' '}
            <small className="text-xs flex-none">{cid}</small>
          </span>
          <small className="text-sm flex-none">by {article?.author.name}</small>
        </h2>
        <p>{article?.content || <Loader />}</p>
      </div>
      <div className="flex card-actions bg-base-200 rounded-none p-2 rounded-b">
        <div className="flex-1">
          {dateFormat(article?.metadata.timestamp)?.toLocaleDateString()}
        </div>
        <div className="flex-none">
          {isLoadingFollow ? (
            <span className="inline-grid ">
              <Loader />
            </span>
          ) : (article?.author.address as Address) !== address ? null : (
            <Swap active={isFollow} onClick={handleFollow}>
              <Icons icon="followed" />
              <Icons icon="unfollowed" />
            </Swap>
          )}

          {isLoadingPin ? (
            <span className="inline-grid ">
              <Loader />
            </span>
          ) : (article?.author.address as Address) === address ? null : (
            <Swap active={isPinned} onClick={handlePin}>
              <Icons icon="pinned" />
              <Icons icon="unpinned" />
            </Swap>
          )}

          {isLoadingLike ? (
            <span className="inline-grid ">
              <Loader />
            </span>
          ) : (
            <Swap active={isLiked} onClick={handleLike}>
              <Icons icon="liked" />
              <Icons icon="unliked" />
            </Swap>
          )}
        </div>
      </div>
    </div>
  );
}
