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

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const project = useGetProject();

  const { users, follows } = useContract();
  const allUsers = users?.map((user) => user?.args._users).flat();

  return (
    <div className={`w-full background-halo ${theme}`}>
      <Header />

      {project.data?.name ? (
        <Drawer>
          <Drawer.Content>{children}</Drawer.Content>
          <Drawer.Side>
            <Accordion name="accordion-side" title="Follow" checked>
              {follows?.map((user) => (
                <li key={user?.args._userFollow}>
                  <a>
                    <Avatar name={user?.args._userFollow} />
                    {displayAdress(user?.args._userFollow)}
                  </a>
                </li>
              ))}
            </Accordion>

            <Accordion name="accordion-side" title="All users">
              {allUsers?.map((user) => (
                <li key={user}>
                  <a>
                    <Avatar name={user} />
                    {displayAdress(user)}
                  </a>
                </li>
              ))}
            </Accordion>
          </Drawer.Side>
        </Drawer>
      ) : (
        children
      )}

      <Footer />
    </div>
  );
}
