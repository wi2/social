import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layout';
import Content from '../../components/Content';
import BubbleChat from '../../components/BubbleChat';
import Textarea from '../../components/Textarea';
import useContract from '../../context/Contract';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { MessageTemplate } from '../../constants/type';
import { messageTemplate } from '../../constants/ipfs';
import { Address, useAccount } from 'wagmi';
import { ipfsGet, ipfsPin } from '../../utils/ipfs';
import { useRouter } from 'next/router';
import useMessage from '../../hooks/useMessage';
import Authorize from '../../components/Authorize';

const Messenger: NextPage = () => {
  //const { setTo } = useMessage();
  const { query } = useRouter();
  const { address } = useAccount();
  const { isConnected, messages } = useContract();
  const [msg, setMsg] = useState([]);
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
            <div className="flex flex-col flex-wrap bg-base-100 bg-opacity-80 m-4 rounded">
              {formattedMessages?.map((item) => (
                <BubbleChat
                  key={`${item?.blockNumber}-${item?.args._cid}`}
                  cid={item?.args._cid}
                />
              ))}
            </div>
          </Authorize>
        </Content>
      </Layout>
    </div>
  );
};

export default Messenger;
