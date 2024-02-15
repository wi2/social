import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Drawer from './Drawer';
import Avatar from './Avatar';
import useTheme from '../context/Theme';
import useContract from '../context/Contract';
import useGetProject from '../hooks/useGetProject';
import { displayAdress } from '../utils/common';
import Accordion from './Accordion';
import { useRouter } from 'next/router';
import useIsUser from '../hooks/useIsUser';

export default function Layout({ children }: { children: ReactNode }) {
  const isUser = useIsUser();
  const { query } = useRouter();
  const { theme } = useTheme();
  const project = useGetProject();

  const { users, follows, profiles } = useContract();
  const allUsers = users?.map((user) => user?.args._users).flat();

  return (
    <div className={`w-full background-halo ${theme}`}>
      <Header />

      {project.data?.name && isUser.data ? (
        <Drawer>
          <Drawer.Content>{children}</Drawer.Content>
          <Drawer.Side>
            {follows?.length ? (
              <Accordion name="accordion-side" title="Follow" checked>
                {follows?.map((user) => {
                  return (
                    <li key={`follow-${user?.args._userFollow}`}>
                      <a
                        href={`/project/messenger?_slug=${query._slug}&_to=${user?.args._userFollow}`}
                      >
                        <Avatar name={user?.args._userFollow} />
                        {profiles[`profile-${user?.args._userFollow}`] ||
                          displayAdress(user?.args._userFollow)}
                      </a>
                    </li>
                  );
                })}
              </Accordion>
            ) : null}

            {allUsers?.length && (
              <Accordion name="accordion-side" title="All users">
                {allUsers?.map((user) => (
                  <li key={`users-${user}`}>
                    <a
                      href={`/project/messenger?_slug=${query._slug}&_to=${user}`}
                    >
                      <Avatar name={user} />
                      {profiles?.[`profile-${user}`] || displayAdress(user)}
                    </a>
                  </li>
                ))}
              </Accordion>
            )}
          </Drawer.Side>
        </Drawer>
      ) : (
        children
      )}

      <Footer />
    </div>
  );
}
