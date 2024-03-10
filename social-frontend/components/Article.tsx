import Icons from './Icons';
import Swap from './Swap';
import { ipfsGet, ipfsPin } from '../utils/ipfs';
import { useCallback, useEffect, useState } from 'react';
import { ArticleTemplate } from '../constants/type';
import { dateFormat } from '../utils/common';
import Loader from './Loader';
import useContract from '../context/Contract';
import useLike from '../hooks/useLike';
import usePin from '../hooks/usePin';
import useFollow from '../hooks/useFollow';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import usePost from '../hooks/usePost';
import useGetProfile from '../hooks/useGetProfile';
import FormComment from './FormComment';
import Comment from './Comment';

export default function Article({ cid }: { cid: Address }) {
  const [isCommentDisplay, setIsCommentDisplay] = useState(false);
  const { address } = useAccount();
  const [article, setArticle] = useState<ArticleTemplate>();
  const { likes, allPins, follows, allLikes, articles, profiles, allComments } =
    useContract();
  const { setLike, isLoading: isLoadingLike } = useLike(cid);
  const { setPin, isLoading: isLoadingPin } = usePin(cid);
  const { setUserFollow, isLoading: isLoadingFollow } = useFollow(
    article?.author.address as Address
  );
  const profile = useGetProfile();
  const { setCid } = usePost();

  const isLiked = likes?.some((like) => like?.args._cid === cid) || false;
  const isPinned = allPins?.some((pin) => pin?.args._cid === cid) || false;
  const isFollow =
    follows?.some((flw) => flw?.args._userFollow === article?.author.address) ||
    false;
  const nbLikes = allLikes?.filter((like) => like?.args._cid === cid).length;

  const handleToggleComment = useCallback(() => {
    setIsCommentDisplay(!isCommentDisplay);
  }, [isCommentDisplay, setIsCommentDisplay]);

  const handleRetweet = useCallback(() => {
    async function main() {
      const now = new Date();
      const newArticle: ArticleTemplate = {
        ...JSON.parse(JSON.stringify(article)),
        retweet: {
          author: article?.author.name,
          address: article?.author.address,
          cid,
        },
      } as unknown as ArticleTemplate;

      if (articles?.length) {
        newArticle.metadata.historic = articles.map(
          (article) => article?.args._cid
        ) as Address[];
      }

      newArticle.metadata.timestamp = now.getTime();
      newArticle.author.address = address;
      newArticle.author.name = profile.data?.pseudo || '';

      ipfsPin(newArticle.title, newArticle).then((_cid) => {
        setCid(_cid as Address);
      });
    }
    main();
  }, [JSON.stringify(article), cid, setCid, profile.data?.pseudo, address]);

  const handleFollow = useCallback(() => {
    setUserFollow(article?.author.address as Address, !isFollow);
  }, [isFollow, setUserFollow, article?.author.address]);

  const handleLike = useCallback(() => {
    setLike(!isLiked);
  }, [isLiked, setLike]);

  const handlePin = useCallback(() => {
    setPin(!isPinned);
  }, [isPinned, setPin]);

  useEffect(() => {
    async function main() {
      const getContent = await ipfsGet(cid);
      setArticle(getContent);
    }
    main();
  }, [cid]);

  const comments = allComments?.filter(
    (comment) => comment?.args._cidArticle === cid
  );

  return (
    <>
      <div className="card card-compact bg-base-100 bg-opacity-80 shadow-xl rounded mr-4 ml-4">
        <div className="card-body">
          <h2 className="card-title">
            <span className="flex-1">
              {article?.retweet?.address && <Icons icon="retweet" />}
              <span className="flex gap-2">
                {allPins?.map((pin) => pin?.args._cid).includes(cid) && (
                  <span className="flex rounded-full bg-base-100 align-center w-7 h-7 items-center justify-center">
                    <Icons icon="pinned" />
                  </span>
                )}
                {article?.title || <Loader />}
              </span>
              <small className="text-xs flex-none opacity-30">
                <br />
                {cid}
              </small>
            </span>
            <small className="text-sm flex-none text-accent">
              by {article?.retweet?.author || article?.author.name}
            </small>
          </h2>
          <p>{article?.content || <Loader />}</p>
        </div>
        <div className="flex card-actions bg-base-200 bg-opacity-50 text-base-content text-xs rounded-none p-2 rounded-b items-center">
          <div className="flex-1 opacity-50">
            {dateFormat(article?.metadata.timestamp)?.toLocaleString()}
          </div>
          <div className="flex gap-4 mr-4">
            {(article?.author.address as Address) !== address && !isFollow && (
              <div
                onClick={handleRetweet}
                className="tooltip"
                data-tip="Retweet this article"
              >
                <Icons icon="retweet" />
              </div>
            )}

            <div
              className="indicator tooltip "
              data-tip={isCommentDisplay ? 'Hide comments' : 'Show comments'}
              onClick={handleToggleComment}
            >
              <Icons icon="comment" />
              <span className="badge badge-sm indicator-item">
                {comments?.length}
              </span>
            </div>

            {isLoadingFollow ? (
              <span className="inline-grid">
                <Loader />
              </span>
            ) : (article?.author.address as Address) === address ? null : (
              <span
                className="tooltip"
                data-tip={`${isFollow ? 'Unfollow' : 'Follow'} ${
                  profiles?.[`profile-${article?.author.address}`]
                }`}
              >
                <Swap active={isFollow} onClick={handleFollow}>
                  <Icons icon="followed" />
                  <Icons icon="unfollowed" />
                </Swap>
              </span>
            )}

            {isLoadingPin ? (
              <span className="inline-grid ">
                <Loader />
              </span>
            ) : (article?.author.address as Address) !== address ? null : (
              <span
                className="tooltip"
                data-tip={isPinned ? 'Unpin article' : 'Pin article'}
              >
                <Swap active={isPinned} onClick={handlePin}>
                  <Icons icon="pinned" />
                  <Icons icon="unpinned" />
                </Swap>
              </span>
            )}

            {isLoadingLike ? (
              <span className="inline-grid">
                <Loader />
              </span>
            ) : (
              <div
                className="indicator tooltip"
                data-tip={isLiked ? 'Unlike article' : 'Like article'}
              >
                <Swap active={isLiked} onClick={handleLike}>
                  <Icons icon="liked" />
                  <Icons icon="unliked" />
                </Swap>
                <span className="badge badge-sm indicator-item">{nbLikes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <>
        <div className="mr-4 -mt-4">
          {comments
            ?.slice(0, isCommentDisplay ? comments.length : 0)
            ?.map((comment) => (
              <Comment
                key={comment?.args._cid}
                cid={comment?.args._cid as Address}
              />
            ))}
          {<FormComment cid={cid} />}
        </div>
      </>
    </>
  );
}
