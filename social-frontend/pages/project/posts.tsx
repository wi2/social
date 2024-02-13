import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../../components/Layout';
import Content from '../../components/Content';
import FormPost from '../../components/FormPost';
import { useRouter } from 'next/router';

const Posts: NextPage = () => {
  const { query } = useRouter();

  return (
    <div>
      <Head>
        <title>Posts</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <div className="flex justify-end pr-4">
            <a
              href={`/project?_slug=${query._slug}`}
              className="btn btn-primary"
            >
              Back
            </a>
          </div>
          <FormPost />
        </Content>
      </Layout>
    </div>
  );
};

export default Posts;
