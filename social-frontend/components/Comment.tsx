import { Address } from 'viem';
import { ipfsGet } from '../utils/ipfs';
import { useEffect, useState } from 'react';
import { CommentTemplate } from '../constants/type';
import Loader from './Loader';
import { dateFormat } from '../utils/common';

export default function Comment({ cid }: { cid: Address }) {
  const [comment, setComment] = useState<CommentTemplate>();

  useEffect(() => {
    async function main() {
      const c = await ipfsGet(cid);
      setComment(c);
    }
    main();
  }, [setComment]);

  return (
    <div className="card card-compact bg-base-300 bg-opacity-50 shadow-xl rounded-none -mt-1 ml-4">
      <div className="card-body">
        <p>
          <small className="text-sm flex-none text-accent">
            {comment?.author.name ? `${comment?.author.name} : ` : ''}
          </small>
          {comment?.content || <Loader />}
        </p>
      </div>
      <div className="flex card-actions bg-base-200 bg-opacity-20 text-base-content text-xs pb-1">
        <div className="flex-1 opacity-50">
          {dateFormat(comment?.metadata.timestamp)?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
