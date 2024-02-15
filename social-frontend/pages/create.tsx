import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../components/Layout';
import Content from '../components/Content';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Divider from '../components/Divider';
import { FormEvent, useCallback } from 'react';
import useContract from '../context/Contract';
import useCreateProject from '../hooks/useCreateProject';

const Create: NextPage = () => {
  const { isConnected } = useContract();
  const { setProject } = useCreateProject();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { project, slug, adresses } = e.currentTarget;

      setProject({
        name: project.value,
        slug: slug.value,
        adresses: adresses.value,
      });
    },
    [setProject]
  );

  return (
    <div>
      <Head>
        <title>Create project</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <Divider>
            <Divider.Left>
              <form className="flex flex-col w-full pl-4" onSubmit={onSubmit}>
                <h2 className="text-4xl font-bold">Create project</h2>

                <div className="mr-4">
                  <div className="divider lg:divider-vertical" />
                </div>

                <div className="flex gap-1">
                  <Input
                    name="project"
                    placeholder="name"
                    disabled={!isConnected}
                  />
                  <Input
                    name="slug"
                    placeholder="slug (only a-z and 0-1, no space)"
                    disabled={!isConnected}
                  />
                </div>

                <div className="mr-4">
                  <div className="divider lg:divider-vertical" />
                </div>

                <label>Add users</label>
                <div className="mr-4">
                  <Textarea name="adresses" disabled={!isConnected}></Textarea>
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
            </Divider.Left>
            <Divider.Line />
            <Divider.Right>
              <div className="pr-4 w-full">
                <h2 className="text-2xl font-bold">Help</h2>
              </div>
            </Divider.Right>
          </Divider>
        </Content>
      </Layout>
    </div>
  );
};

export default Create;
