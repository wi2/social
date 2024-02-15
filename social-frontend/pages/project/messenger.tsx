import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layout';
import Content from '../../components/Content';
import BubbleChat from '../../components/BubbleChat';
import Textarea from '../../components/Textarea';
import useContract from '../../context/Contract';
import { FormEvent, useCallback, useState } from 'react';
import { MessageTemplate } from '../../constants/type';
import { messageTemplate } from '../../constants/ipfs';
import { Address, useAccount } from 'wagmi';
import { ipfsPin } from '../../utils/ipfs';
import { useRouter } from 'next/router';
import useMessage from '../../hooks/useMessage';
import Authorize from '../../components/Authorize';

const Messenger: NextPage = () => {
  const { query } = useRouter();
  const { setCid } = useMessage(query?._to as Address);
  const { address } = useAccount();
  const { isConnected, messages } = useContract();
  const [msg, setMsg] = useState([]);
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { content } = e.currentTarget;
    async function main() {
      const now = new Date();
      const newMsg: MessageTemplate = {
        ...messageTemplate,
      } as unknown as MessageTemplate;
      newMsg.metadata.timestamp = now.getTime();
      newMsg.from.address = address as Address;
      newMsg.to.address = query._to as Address;
      newMsg.content = content.value;

      ipfsPin('message', newMsg).then((cid) => {
        setCid(cid as Address);
      });
    }
    main();
  }, []);

  const formattedMessages = messages?.filter((message) => {
    const users = [message?.args._from, message?.args._to];
    return users.includes(address) && users.includes(query._to as Address);
  });

  return (
    <div>
      <Head>
        <title>Messenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Authorize>
            <div className="flex flex-col flex-wrap bg-neutral bg-opacity-80 m-4 p-4 rounded">
              {formattedMessages?.map((item) => (
                <BubbleChat
                  key={`${item?.blockNumber}-${item?.args._cid}`}
                  cid={item?.args._cid}
                />
              ))}
            </div>
            <div className="sticky bottom-16 z-50 mr-4">
              <form className="flex flex pl-4 w-full" onSubmit={onSubmit}>
                <div className="flex-grow">
                  <Textarea name="content" disabled={!isConnected}></Textarea>
                </div>
                <div>
                  <button className="btn w-24 h-40" disabled={!isConnected}>
                    Send
                  </button>
                </div>
              </form>
            </div>
          </Authorize>
        </Content>
      </Layout>
    </div>
  );
};

export default Messenger;
