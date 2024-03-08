import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { ipfsGet } from '../utils/ipfs';
import { MessageTemplate } from '../constants/type';
import Avatar from './Avatar';
import { dateFormat } from '../utils/common';
import Loader from './Loader';

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

  if (!message?.from.address) {
    return <Loader />;
  }

  if (isMyMessage) {
    return (
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <Avatar name={message?.from.address as Address} />
        </div>
        <div className="chat-header">{message?.from.name}</div>
        <div className="chat-bubble">{message?.content}</div>
        <time className="chat-footer opacity-50 text-xs">
          {dateFormat(message?.metadata.timestamp)?.toLocaleString()}
        </time>
      </div>
    );
  }
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <Avatar name={message?.from.address as Address} />
      </div>
      <div className="chat-header">{message?.from.name}</div>
      <div className="chat-bubble">{message?.content}</div>
      <time className="chat-footer opacity-50 text-xs">
        {dateFormat(message?.metadata.timestamp)?.toLocaleString()}
      </time>
    </div>
  );
}
