import { useRouter } from 'next/router';
import { CustomLogArticleArgsType } from '../constants/type';
import useContract from '../context/Contract';
import { getEventSorted } from '../utils/contract';
import Article from './Article';
import Link from 'next/link';
import { displayAdress } from '../utils/common';
import { Address } from 'viem';

export default function Articles() {
  const { query } = useRouter();
  const { allArticles, articles, followedArticles, allPins, pins, profiles } =
    useContract();

  let articlesSorted = query._to
    ? allArticles
        ?.filter((article) => article?.args._author === query._to)
        .reverse()
    : getEventSorted<CustomLogArticleArgsType>(
        articles || [],
        followedArticles || []
      ).reverse() || [];

  const choosePins = query._to ? allPins : pins;

  if (choosePins?.length) {
    choosePins?.forEach((pin) => {
      const index =
        articlesSorted?.findIndex(
          (item) => item?.args._cid === pin?.args._cid
        ) || 0;

      articlesSorted = articlesSorted?.length
        ? [
            articlesSorted?.[index || 0],
            ...articlesSorted.slice(0, index),
            ...articlesSorted.slice(index + 1, articlesSorted.length),
          ]
        : [];
    });
  }

  let cids = articlesSorted?.map((item) => item?.args._cid);
  cids = cids?.filter((item, index) => item && cids?.indexOf(item) === index);

  if (!cids?.length) {
    if (!query._to) {
      return (
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
            <div>
              <h1 className="text-4xl font-bold text-secondary">Welcome</h1>
              <p className="py-6">
                Start to add article and follows to see them here.
              </p>
              <span className="flex justify-end">
                <Link
                  href={`/project/posts?_slug=${query._slug}`}
                  className="btn btn-accent text-accent-content"
                >
                  Post
                </Link>
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
            <div>
              <p className="py-6">
                {profiles?.[`profile-${query._to as Address}`] ||
                  displayAdress(query._to as Address)}{' '}
                has not published any articles
              </p>
              <span className="flex justify-around">
                <Link
                  href={`/project/?_slug=${query._slug}`}
                  className="btn btn-accent text-accent-content"
                >
                  Go to homepage
                </Link>
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="flex justify-end pr-4">
        <Link
          href={`/project/posts?_slug=${query._slug}`}
          className="btn btn-accent text-accent-content"
        >
          Add Article
        </Link>
      </div>
      <div className="flex flex-col gap-4 pt-4 pb-4">
        {cids?.map((articleCid) => (
          <Article cid={articleCid as Address} key={articleCid} />
        ))}
      </div>
    </>
  );
}
