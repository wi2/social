import { useRouter } from 'next/router';
import { CustomLogArticleArgsType } from '../constants/type';
import useContract from '../context/Contract';
import { getEventSorted } from '../utils/contract';
import Article from './Article';

export default function Articles() {
  const { query } = useRouter();
  const { allArticles, articles, followedArticles, allPins, pins } =
    useContract();

  let articlesSorted = query._to
    ? allArticles?.filter((article) => article?.args._author === query._to)
    : getEventSorted<CustomLogArticleArgsType>(
        articles || [],
        followedArticles || []
      ) || [];

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

  articlesSorted = articlesSorted?.filter((item) => item);

  if (!articlesSorted?.length) {
    return (
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row bg-primary-content bg-opacity-70 rounded-md">
          <div>
            <h1 className="text-4xl font-bold text-secondary">Welcome</h1>
            <p className="py-6">
              Start to add article and follows to see them here.
            </p>
            <a
              href={`/project/posts?_slug=${query._slug}`}
              className="btn btn-primary"
            >
              Post
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end pr-4">
        <a
          href={`/project/posts?_slug=${query._slug}`}
          className="btn btn-accent text-accent-content"
        >
          Add Article
        </a>
      </div>
      <div className="flex flex-col gap-4 pt-4 pb-4">
        {articlesSorted.map((article) => (
          <Article cid={article?.args._cid} key={article?.args._cid} />
        ))}
      </div>
    </>
  );
}
