import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Hero />
      </Layout>
    </div>
  );
};

export default Home;
