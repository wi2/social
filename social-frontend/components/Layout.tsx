import { ReactNode, useCallback } from 'react';
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
import Swap from './Swap';
import { Address, useAccount } from 'wagmi';
import Icons from './Icons';
import useFollow from '../hooks/useFollow';
import Loader from './Loader';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  const { query } = useRouter();
  const { address } = useAccount();
  const { theme } = useTheme();
  const isUser = useIsUser();
  const project = useGetProject();
  const { setUserFollow, isLoading, isFetching } = useFollow(undefined);

  const { users, follows, profiles } = useContract();
  const myFollows = follows?.filter((flw) => flw?.args._me === address);

  const handleFollow = useCallback(
    (_user: Address, _active: boolean) => {
      setUserFollow(_user, _active);
    },
    [setUserFollow]
  );

  return (
    <div className={`w-full background-halo ${theme}`}>
      <Header />

      {project.data?.name && isUser.data ? (
        <Drawer>
          <Drawer.Content>{children}</Drawer.Content>
          <Drawer.Side>
            {users?.length && (
              <Accordion name="accordion-side" title="All users" checked>
                {users
                  ?.filter((user) => user !== address)
                  .map((user) => (
                    <li
                      key={`users-${user}`}
                      className={
                        query._to === user
                          ? 'bg-base-100 bg-opacity-60 rounded-md'
                          : ''
                      }
                    >
                      <div className="flex flex-row justify-between items-center">
                        <Link
                          href={`/project?_slug=${query._slug}&_to=${user}`}
                          className="tooltip"
                          data-tip={`See ${
                            profiles?.[`profile-${user}`]
                          } Articles`}
                        >
                          <Avatar name={user} noTooltip />
                          <span className="pl-4">
                            {profiles?.[`profile-${user}`] ||
                              displayAdress(user)}
                          </span>
                        </Link>
                        <span className="flex flex-row gap-3 items-center">
                          {isLoading || isFetching ? (
                            <span className="inline-grid ">
                              <Loader />
                            </span>
                          ) : (
                            <span
                              className="tooltip"
                              data-tip={`${
                                myFollows?.some(
                                  (follow) => follow?.args._userFollow === user
                                ) || false
                                  ? 'Unfollow'
                                  : 'Follow'
                              } ${profiles?.[`profile-${user}`]}`}
                            >
                              <Swap
                                active={
                                  myFollows?.some(
                                    (follow) =>
                                      follow?.args._userFollow === user
                                  ) || false
                                }
                                onClick={() =>
                                  handleFollow(
                                    user as Address,
                                    !myFollows?.some(
                                      (follow) =>
                                        follow?.args._userFollow === user
                                    ) || false
                                  )
                                }
                              >
                                <Icons icon="followed" />
                                <Icons icon="unfollowed" />
                              </Swap>
                            </span>
                          )}
                          <Link
                            href={`/project/messenger?_slug=${query._slug}&_to=${user}`}
                            className="tooltip tooltip-left"
                            data-tip={`chat with ${
                              profiles?.[`profile-${user}`]
                            }`}
                          >
                            <Icons icon="chat" />
                          </Link>
                        </span>
                      </div>
                    </li>
                  ))}
              </Accordion>
            )}

            {myFollows?.length ? (
              <Accordion
                name="accordion-side"
                title={`Follow (${myFollows?.length || 0})`}
              >
                {myFollows?.map((user) => {
                  return (
                    <li
                      key={`follow-${user?.args._userFollow}`}
                      className={
                        query._to === user?.args._userFollow
                          ? 'bg-base-100 bg-opacity-60 rounded-md'
                          : ''
                      }
                    >
                      <div className="flex flex-row justify-between items-center">
                        <Link
                          href={`/project?_slug=${query._slug}&_to=${user?.args._userFollow}`}
                          className="tooltip"
                          data-tip={`See ${
                            profiles?.[`profile-${user?.args._userFollow}`]
                          } Articles`}
                        >
                          <Avatar name={user?.args._userFollow} noTooltip />
                          <span className="pl-4">
                            {profiles[`profile-${user?.args._userFollow}`] ||
                              displayAdress(user?.args._userFollow)}
                          </span>
                        </Link>
                        <span className="flex flex-row gap-3 items-center">
                          {isLoading ? (
                            <span className="inline-grid ">
                              <Loader />
                            </span>
                          ) : (
                            <span
                              className="tooltip"
                              data-tip={`Unfollow ${
                                profiles?.[`profile-${user?.args._userFollow}`]
                              }`}
                            >
                              <Swap
                                active
                                onClick={() =>
                                  handleFollow(
                                    user?.args._userFollow as Address,
                                    false
                                  )
                                }
                              >
                                <Icons icon="followed" />
                                <Icons icon="unfollowed" />
                              </Swap>
                            </span>
                          )}
                          <Link
                            href={`/project/messenger?_slug=${query._slug}&_to=${user?.args._userFollow}`}
                            className="tooltip tooltip-left"
                            data-tip={`chat with ${
                              profiles?.[`profile-${user?.args._userFollow}`]
                            }`}
                          >
                            <Icons icon="chat" />
                          </Link>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </Accordion>
            ) : null}
          </Drawer.Side>
        </Drawer>
      ) : (
        children
      )}

      <Footer />
    </div>
  );
}
