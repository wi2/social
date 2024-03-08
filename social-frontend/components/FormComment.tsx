import { FormEvent, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

import useContract from '../context/Contract';
import Textarea from './Textarea';
import { CommentTemplate } from '../constants/type';
import { comment } from '../constants/ipfs';
import useGetProfile from '../hooks/useGetProfile';
import useComment from '../hooks/useComment';
import { ipfsPin } from '../utils/ipfs';

export default function FormComment({ cid }: { cid: Address }) {
  const { address } = useAccount();
  const { isConnected, allComments } = useContract();
  const { setCid } = useComment(cid);
  const profile = useGetProfile();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { content } = e.currentTarget;
      async function main() {
        const now = new Date();
        const newComment: CommentTemplate = {
          ...comment,
        } as unknown as CommentTemplate;
        if (allComments?.length) {
          newComment.metadata.historic = allComments.map(
            (c) => c?.args._cid
          ) as Address[];
        }
        newComment.metadata.timestamp = now.getTime();
        newComment.metadata.cid = cid;
        newComment.author.address = address;
        newComment.author.name = profile.data?.pseudo;
        newComment.content = content.value;

        ipfsPin(`comment-${cid}`, newComment).then((_cid) => {
          setCid(_cid as Address);
          content.value = '';
        });
      }
      main();
    },
    [allComments?.length, cid, setCid, address, profile.data?.pseudo]
  );

  return (
    <form className="flex flex pl-4 w-full" onSubmit={onSubmit}>
      <div className="flex-grow">
        <Textarea
          className="rounded-none rounded-b h16 max-h-16 bg-neutral text-neutral-content"
          name="content"
          disabled={!isConnected}
        ></Textarea>
      </div>
      <div>
        <button
          className="btn btn-accent w-24 h-16 rounded-none rounded-br"
          disabled={!isConnected}
        >
          Add comment
        </button>
      </div>
    </form>
  );
}
