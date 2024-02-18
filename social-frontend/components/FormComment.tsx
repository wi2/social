import useContract from '../context/Contract';
import { FormEvent, useCallback } from 'react';
import Textarea from './Textarea';
import { ipfsPin } from '../utils/ipfs';
import { comment } from '../constants/ipfs';
import { Address, useAccount } from 'wagmi';
import { CommentTemplate } from '../constants/type';
import useGetProfile from '../hooks/useGetProfile';
import useComment from '../hooks/useComment';

export default function FormComment({ cid }: { cid: Address }) {
  const { address } = useAccount();
  const { isConnected } = useContract();
  const { setCid } = useComment(cid);
  const { allComments } = useContract();
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
        newComment.author.name = profile.data.pseudo;
        newComment.content = content.value;

        ipfsPin(`comment-${cid}`, newComment).then((cid) => {
          setCid(cid as Address);
          content.value = '';
        });
      }
      main();
    },
    [allComments?.length, setCid, address]
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
