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
  //const { setTo } = useMessage();
  const { query } = useRouter();
  const { address } = useAccount();
  const { isConnected } = useContract();
  const messages = [] as { user: any; content: string; time: any }[];

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*  const { content } = e.currentTarget;
      async function main() {
        const now = new Date();
        const newMsg: MessageTemplate = {
          ...messageTemplate,
        } as unknown as MessageTemplate;
        newMsg.metadata.timestamp = now.getTime();
        newMsg.from.address = address;
        newMsg.to.address = query._to;
        newMsg.content = content.value;

        console.log(newMsg);

        ipfsPin('message', newMsg).then((cid) => {
          setTo(cid as Address);
        });
      }
      main(); */
  }, []);

  return (
    <div>
      <Head>
        <title>Messenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Authorize>
            <form className="flex flex-col w-full pl-4" onSubmit={onSubmit}>
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

            {messages.map((item) => (
              <BubbleChat
                key={item.time}
                user={item.user}
                content={item.content}
                time={item.time}
              />
            ))}
          </Authorize>
        </Content>
      </Layout>
    </div>
  );
};

export default Messenger;
