import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Content from '../../components/Content';
import Articles from '../../components/Articles';
import Authorize from '../../components/Authorize';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Authorize>
            <Articles />
          </Authorize>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
