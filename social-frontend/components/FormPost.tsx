import useContract from '../context/Contract';
import { FormEvent, useCallback } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import { ipfsPin } from '../utils/ipfs';
import { article } from '../constants/ipfs';
import { useAccount } from 'wagmi';
import usePost from '../hooks/usePost';
import { ArticleTemplate } from '../constants/type';
import { useRouter } from 'next/router';
import useGetProfile from '../hooks/useGetProfile';
import Link from 'next/link';
import { Address } from 'viem';

export default function FormPost() {
  const { query } = useRouter();
  const { address } = useAccount();
  const { isConnected } = useContract();
  const { setCid } = usePost();
  const { articles } = useContract();
  const profile = useGetProfile();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { titleArticle, content } = e.currentTarget;
      async function main() {
        const now = new Date();
        const newArticle: ArticleTemplate = {
          ...article,
        } as unknown as ArticleTemplate;
        if (articles?.length) {
          newArticle.metadata.historic = articles.map(
            (article) => article?.args._cid
          ) as Address[];
        }
        newArticle.metadata.timestamp = now.getTime();
        newArticle.author.address = address;
        newArticle.author.name = profile.data?.pseudo || '';
        newArticle.title = titleArticle.value;
        newArticle.content = content.value;

        ipfsPin(titleArticle.value, newArticle).then((cid) => {
          setCid(cid as Address);
          titleArticle.value = '';
          content.value = '';
        });
      }
      main();
    },
    [articles?.length, setCid, address, profile.data?.pseudo]
  );

  return (
    <div className="bg-base-300 bg-opacity-80 rounded mr-4 pb-4 pt-4">
      <div className="flex justify-end pr-4">
        <Link
          href={`/project?_slug=${query._slug}`}
          className="btn btn-accent text-accent-content"
        >
          Back
        </Link>
      </div>
      <form className="flex flex-col w-full pl-4" onSubmit={onSubmit}>
        <h2 className="text-4xl font-bold">Create Article</h2>

        <div className="mr-4">
          <div className="divider lg:divider-vertical" />
        </div>

        <div className="flex gap-1">
          <Input
            name="titleArticle"
            placeholder="title"
            disabled={!isConnected}
          />
        </div>

        <div className="mr-4">
          <div className="divider lg:divider-vertical" />
        </div>

        <label>Content</label>
        <div className="mr-4">
          <Textarea name="content" disabled={!isConnected}></Textarea>
        </div>

        <div className="mr-4">
          <div className="divider lg:divider-vertical" />
        </div>

        <div>
          <button
            className="btn bg-accent text-accent-content"
            disabled={!isConnected}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
