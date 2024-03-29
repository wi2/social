import { ReactNode, useCallback } from 'react';

import Icons from './Icons';
import Drawer from './Drawer';
import Avatar from './Avatar';
import Swap from './Swap';
import { Theme } from '../constants/type';
import useTheme from '../context/Theme';
import Link from 'next/link';
import useGetProject from '../hooks/useGetProject';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import useIsConnected from '../hooks/useIsConnected';
import Loader from './Loader';
import useIsUser from '../hooks/useIsUser';

export default function Header({ children }: { children?: ReactNode }) {
  const isConnected = useIsConnected();
  const isUser = useIsUser();
  const { address } = useAccount();
  const { query } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const project = useGetProject();

  const handleToggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      toggleTheme?.();
      window.location.reload();
    },
    [toggleTheme]
  );

  const links = [
    { link: `/project?_slug=${query._slug}`, name: 'Home' },
    { link: `/project/dashboard?_slug=${query._slug}`, name: 'Dashboard' },
    { link: `/project/posts?_slug=${query._slug}`, name: 'Add Post' },
  ];

  return (
    <div className={`navbar fixed bg-base-300 bg-opacity-90 z-10`}>
      <div className="navbar-start">
        {project.data?.name && isUser.data ? (
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <Icons icon="menu" />
            </div>
            {children}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {links.map(({ link, name }) => (
                <li key={name}>
                  <Link href={link}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="navbar-center">
        <Link
          href={project.data?.name ? `/project?_slug=${query._slug}` : ''}
          className="btn btn-ghost text-accent text-xl"
        >
          {project.data?.name || 'dsnMaker'}
        </Link>
      </div>
      {isUser.data ? (
        <div className="navbar-end gap-2">
          <Drawer.Toggle>Open</Drawer.Toggle>
          <button
            className="bg-base-100 rounded-full p-1 h-7 w-7"
            onClick={handleToggleTheme}
          >
            <Swap active={theme === Theme.dark}>
              <Icons icon="moon" />
              <Icons icon="sun" />
            </Swap>
          </button>
          <button className="btn btn-ghost btn-circle">
            {!isConnected ? <Loader /> : <Avatar name={address} />}
          </button>
        </div>
      ) : null}
    </div>
  );
}
