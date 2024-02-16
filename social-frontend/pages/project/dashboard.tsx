import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layout';
import Content from '../../components/Content';
import Board from '../../components/Board';
import Authorize from '../../components/Authorize';

const Dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Authorize>
            <Board />
          </Authorize>
        </Content>
      </Layout>
    </div>
  );
};

export default Dashboard;
