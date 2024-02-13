import { CustomLogArticleArgsType } from '../constants/type';
import useContract from '../context/Contract';
import { getEventSorted } from '../utils/contract';
import Article from './Article';

export default function Articles() {
  const { articles, followedArticles } = useContract();

  const articlesSorted = getEventSorted<CustomLogArticleArgsType>(
    articles || [],
    followedArticles || []
  );

  return (
    <div className="flex flex-col gap-4 pt-4 pb-4">
      {articlesSorted?.map((article) => (
        <Article cid={article?.args._cid} key={article?.args._cid} />
      ))}
    </div>
  );
}
