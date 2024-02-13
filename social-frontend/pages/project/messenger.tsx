import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layout';
import Content from '../../components/Content';
import BubbleChat from '../../components/BubbleChat';

const Messenger: NextPage = () => {
  const messages = [] as { user: any; content: string; time: any }[];

  return (
    <div>
      <Head>
        <title>Messenger</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          {messages.map((item) => (
            <BubbleChat
              key={item.time}
              user={item.user}
              content={item.content}
              time={item.time}
            />
          ))}
        </Content>
      </Layout>
    </div>
  );
};

export default Messenger;
