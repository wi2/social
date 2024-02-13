import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Content from '../../components/Content';
import Articles from '../../components/Articles';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Articles />
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
