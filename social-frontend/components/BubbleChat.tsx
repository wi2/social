import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { ipfsGet } from '../utils/ipfs';
import { MessageTemplate } from '../constants/type';
import { useAccount } from 'wagmi';
import Avatar from './Avatar';
import { dateFormat } from '../utils/common';

export default function BubbleChat({ cid }: { cid: Address | undefined }) {
  const { address } = useAccount();
  const [message, setMessage] = useState<MessageTemplate>();

  useEffect(() => {
    async function main() {
      const getContent = await ipfsGet(cid);
      setMessage(getContent);
    }
    main();
  }, [cid, setMessage]);

  const isMyMessage = message?.from.address === address;
  return (
    <div
      className={`chat chat-${isMyMessage ? 'end' : 'start'} p-4 grid-cols-${
        isMyMessage ? '1' : '2'
      } place-items-end`}
    >
      <div className="chat-image avatar">
        <Avatar name={message?.from.address as Address} />
      </div>
      <div
        className={`chat-header justify-self-${isMyMessage ? 'end' : 'start'}`}
      >
        {message?.from.name}
      </div>
      <div
        className={`chat-bubble justify-self-${isMyMessage ? 'end' : 'start'}`}
      >
        <div>{message?.content}</div>
      </div>
      <div
        className={`chat-footer justify-self-${isMyMessage ? 'end' : 'start'}`}
      >
        <time className="text-xs opacity-50">
          {dateFormat(message?.metadata.timestamp)?.toLocaleString()}
        </time>
      </div>
    </div>
  );
}
