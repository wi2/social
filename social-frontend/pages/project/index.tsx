import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Content from '../../components/Content';
import Articles from '../../components/Articles';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { query } = useRouter();

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <div className="flex justify-end pr-4">
            <a
              href={`/project/posts?_slug=${query._slug}`}
              className="btn btn-primary"
            >
              Add
            </a>
          </div>
          <Articles />
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
