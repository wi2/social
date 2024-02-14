import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layout';
import Content from '../../components/Content';
import FormPost from '../../components/FormPost';
import Authorize from '../../components/Authorize';

const Posts: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Posts</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Authorize>
            <FormPost />
          </Authorize>
        </Content>
      </Layout>
    </div>
  );
};

export default Posts;
