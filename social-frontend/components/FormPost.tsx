import Head from 'next/head';

import useContract from '../context/Contract';
import { FormEvent, useCallback } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import { ipfsPin } from '../utils/ipfs';
import { article } from '../constants/ipfs';
import { Address, useAccount } from 'wagmi';
import usePost from '../hooks/usePost';
import { ArticleTemplate } from '../constants/type';

export default function FormPost() {
  const { address } = useAccount();
  const { isConnected } = useContract();
  const { setCid } = usePost();
  const { articles } = useContract();

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
        newArticle.title = titleArticle.value;
        newArticle.content = content.value;

        ipfsPin(titleArticle.value, newArticle).then((cid) => {
          setCid(cid as Address);
        });
      }
      main();
    },
    [articles?.length, setCid]
  );
  return (
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
        <button className="btn" disabled={!isConnected}>
          Create
        </button>
      </div>
    </form>
  );
}
