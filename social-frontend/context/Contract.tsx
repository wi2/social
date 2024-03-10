import { ReactNode, createContext, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

import useIsConnected from '../hooks/useIsConnected';
import useIsOwner from '../hooks/useIsOwner';
import useWatch from '../hooks/useWatch';
import {
  CustomLogActionArgsType,
  CustomLogArticleArgsType,
  CustomLogCommentArgsType,
  CustomLogFollowArgsType,
  CustomLogMessageArgsType,
  CustomLogProfileArgsType,
  CustomLogType,
  CustomLogUserArgsType,
} from '../constants/type';
import {
  getArticles,
  getComments,
  getFollowers,
  getLikes,
  getMessages,
  getPins,
  getProfiles,
} from '../utils/contract';

interface ContractContextType {
  isConnected: boolean;
  isOwner: boolean;
  // account
  users?: (Address | undefined)[];
  // network
  allArticles?: CustomLogType<CustomLogArticleArgsType>[];
  articles?: CustomLogType<CustomLogArticleArgsType>[];
  allComments?: CustomLogType<CustomLogCommentArgsType>[];
  comments?: CustomLogType<CustomLogCommentArgsType>[];
  follows?: CustomLogType<CustomLogFollowArgsType>[];
  followedArticles?: CustomLogType<CustomLogArticleArgsType>[];
  likes?: CustomLogType<CustomLogActionArgsType>[];
  allLikes?: CustomLogType<CustomLogActionArgsType>[];
  pins?: CustomLogType<CustomLogActionArgsType>[];
  allPins?: CustomLogType<CustomLogActionArgsType>[];
  messages?: CustomLogType<CustomLogMessageArgsType>[];
  profiles?: CustomLogProfileArgsType;
}

export const ContractContext = createContext<ContractContextType>({
  isConnected: false,
  isOwner: false,
});

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  const isConnected = useIsConnected();
  const isOwner = useIsOwner();

  const allLogs = useWatch();

  // account
  const UsersCreated = allLogs.filter(
    (log) => log?.eventName === 'UsersCreated'
  ) as CustomLogType<CustomLogUserArgsType>[];

  // profile
  const UpdatePseudo = allLogs.filter(
    (log) => log?.eventName === 'UpdatePseudo'
  );

  // messenger
  const MessageSended = allLogs.filter(
    (log) => log?.eventName === 'MessageSended'
  );

  // network
  const articlesPosted = allLogs.filter(
    (log) => log?.eventName === 'ArticlePosted'
  );

  const commentPosted = allLogs.filter((log) => log?.eventName === 'Comment');

  const followed = allLogs.filter((log) => log?.eventName === 'Followed');
  const unfollowed = allLogs.filter((log) => log?.eventName === 'Unfollowed');

  const liked = allLogs.filter((log) => log?.eventName === 'Liked');
  const unliked = allLogs.filter((log) => log?.eventName === 'Unliked');

  const pinned = allLogs.filter((log) => log?.eventName === 'Pinned');
  const unpinned = allLogs.filter((log) => log?.eventName === 'Unpinned');

  const messages = getMessages(MessageSended, address);

  const follows = getFollowers(followed, unfollowed, address);

  const allLikes = getLikes(liked, unliked);
  const likes = allLikes.filter((item) => item?.args._me === address);

  const allPins = getPins(pinned, unpinned);
  const pins = allPins.filter((item) => item?.args._me === address);

  const allArticles = getArticles(articlesPosted);
  const articles = allArticles.filter((item) => item?.args._author === address);

  const allComments = getComments(commentPosted);
  const comments = allComments.filter((item) => item?.args._author === address);

  const followedArticles = follows
    .map((follow) => follow.args._userFollow)
    .map((addr) =>
      getArticles(articlesPosted).filter((item) => item?.args._author === addr)
    )
    .flat();

  const users = UsersCreated.map((user) => user?.args._users).flat();

  const allProfiles = [...UpdatePseudo];
  const profiles = getProfiles(allProfiles);

  return (
    <ContractContext.Provider
      value={{
        isConnected,
        isOwner,
        users,
        allArticles,
        articles,
        allComments,
        comments,
        followedArticles,
        follows,
        likes,
        allLikes,
        pins,
        allPins,
        messages,
        profiles,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default function useContract() {
  return useContext(ContractContext);
}

export function Contract({ children }: { children: ReactNode }) {
  return <ContractProvider>{children}</ContractProvider>;
}
