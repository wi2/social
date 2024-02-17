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
import NotConnected from '../components/NotConnected';

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
        <title>Create Your social network</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Layout>
        <Content>
          <NotConnected>
            <Divider>
              <Divider.Left>
                <div className="w-full ml-4 bg-base-300 text-base-content bg-opacity-70 rounded-md">
                  <form
                    className="flex flex-col w-full pt-4 pl-4 pb-4"
                    onSubmit={onSubmit}
                  >
                    <h2 className="text-4xl text-accent font-bold">
                      Create Your social network
                    </h2>

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
                        placeholder="slug ([a-z0-1-]) no space"
                        disabled={!isConnected}
                      />
                    </div>

                    <div className="mr-4">
                      <div className="divider lg:divider-vertical" />
                    </div>

                    <label>
                      Add users <small>(separate by ,)</small>
                    </label>
                    <div className="mr-4">
                      <Textarea
                        name="adresses"
                        disabled={!isConnected}
                      ></Textarea>
                    </div>

                    <div className="mr-4">
                      <div className="divider lg:divider-vertical" />
                    </div>

                    <div className="flex justify-end pr-4">
                      <button
                        className="btn btn-accent"
                        disabled={!isConnected}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </Divider.Left>
              <Divider.Line />
              <Divider.Right>
                <div className="w-full max-w-md h-full p-4 ml-4 mr-4 bg-base-100 text-base-content bg-opacity-70 rounded-md">
                  <h2 className="text-2xl font-bold text-secondary">Help</h2>
                  <p className="font-bold text-secondary pt-4">
                    Fill information of your project
                  </p>
                  <ul className="list-disc ml-6 flex flex-col gap-4 pt-4">
                    <li>
                      Give a <strong className="text-secondary">name</strong> to
                      your project
                    </li>
                    <li>
                      Fill <strong className="text-secondary">slug</strong>,
                      this is for your url project, only use{' '}
                      <strong className="text-secondary">[a-z0-9-]</strong> in
                      lowercase.
                      <br />
                      Your project will bee available at:
                      <br />
                      <strong className="text-secondary">
                        /project?_slug=myproject
                      </strong>
                    </li>
                    <li>
                      Add all{' '}
                      <strong className="text-secondary">adresses</strong> of
                      your users separate by '
                      <strong className="text-secondary">,</strong>'.
                    </li>
                  </ul>
                </div>
              </Divider.Right>
            </Divider>
          </NotConnected>
        </Content>
      </Layout>
    </div>
  );
};

export default Create;
