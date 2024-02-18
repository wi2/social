import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import useIsConnected from '../hooks/useIsConnected';
import useIsOwner from '../hooks/useIsOwner';
import useWatch from '../hooks/useWatch';
import { JSON_FILES, jsonFiles } from '../constants/contract';
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
} from '../utils/contract';
import { Address, useAccount } from 'wagmi';
import useWatchAll from '../hooks/useWatchAll';
import useRefresh from '../hooks/useRefresh';

type objectType = { [k: Address]: string };

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
  profiles?: any;
}

export const ContractContext = createContext<ContractContextType>({
  isConnected: false,
  isOwner: false,
});

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [completeData, setCompleteData] = useState<ContractContextType>({
    isConnected: false,
    isOwner: false,
  });
  const [watchData, setWatchData] = useState({
    unfollowed: [],
    followed: [],
    liked: [],
    unliked: [],
    pinned: [],
    unpinned: [],
    articlesPosted: [],
    commentPosted: [],
    messages: [],
    profiles: [],
  });
  const data = useWatchAll();
  const { isRefresh, refresh } = useRefresh();

  const { address } = useAccount();
  const isConnected = useIsConnected();
  const isOwner = useIsOwner();
  // account
  const UsersCreated = useWatch<CustomLogUserArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.account].abi.find(
          ({ name, type }) => name === 'UsersCreated' && type === 'event'
        )
      : null
  );

  // profile
  const UpdatePseudo = useWatch<CustomLogProfileArgsType>(
    jsonFiles[JSON_FILES.profile].abi.find(
      ({ name, type }) => name === 'UpdatePseudo' && type === 'event'
    )
  );

  // messenger
  const MessageSended = useWatch<CustomLogMessageArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.messenger].abi.find(
          ({ name, type }) => name === 'MessageSended' && type === 'event'
        )
      : null
  );

  // network
  const articlesPosted = useWatch<CustomLogArticleArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'ArticlePosted' && type === 'event'
        )
      : null
  );

  const commentPosted = useWatch<CustomLogCommentArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Comment' && type === 'event'
        )
      : null
  );

  const followed = useWatch<CustomLogFollowArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Followed' && type === 'event'
        )
      : null
  );

  const unfollowed = useWatch<CustomLogFollowArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Unfollowed' && type === 'event'
        )
      : null
  );

  const liked = useWatch<CustomLogActionArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Liked' && type === 'event'
        )
      : null
  );

  const unliked = useWatch<CustomLogActionArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Unliked' && type === 'event'
        )
      : null
  );

  const pinned = useWatch<CustomLogActionArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Pinned' && type === 'event'
        )
      : null
  );
  const unpinned = useWatch<CustomLogActionArgsType>(
    isRefresh
      ? jsonFiles[JSON_FILES.network].abi.find(
          ({ name, type }) => name === 'Unpinned' && type === 'event'
        )
      : null
  );

  const messages = getMessages(
    [...MessageSended, ...watchData.messages],
    address
  );

  const follows = getFollowers(
    [...followed, ...watchData.followed, ...(completeData.follows || [])],
    [...unfollowed, ...watchData.unfollowed],
    address
  );

  const allLikes = getLikes(
    [...liked, ...watchData.liked, ...(completeData.likes || [])],
    [...unliked, ...watchData.unliked]
  );

  const likes = allLikes.filter(
    (item) =>
      (item as CustomLogType<CustomLogActionArgsType>)?.args._me === address
  );

  const allPins = getPins(
    [...pinned, ...watchData.pinned, ...(completeData.pins || [])],
    [...unpinned, ...watchData.unpinned]
  );

  const pins = allPins.filter(
    (item) =>
      (item as CustomLogType<CustomLogActionArgsType>)?.args._me === address
  );
  const allArticles = getArticles([
    ...articlesPosted,
    ...watchData.articlesPosted,
    ...(completeData.articles || []),
    ...(completeData.allArticles || []),
  ]);

  const articles = allArticles.filter(
    (item) =>
      (item as CustomLogType<CustomLogArticleArgsType>)?.args._author ===
      address
  );

  const allComments = getComments([
    ...commentPosted,
    ...watchData.commentPosted,
    ...(completeData.comments || []),
    ...(completeData.allComments || []),
  ]);

  const comments = allComments.filter(
    (item) =>
      (item as CustomLogType<CustomLogArticleArgsType>)?.args._author ===
      address
  );

  const followedArticles = follows
    .map((follow) => follow.args._userFollow)
    .map((addr) =>
      getArticles(articlesPosted).filter(
        (item) =>
          (item as CustomLogType<CustomLogArticleArgsType>)?.args._author ===
          addr
      )
    )
    .flat();

  const users = UsersCreated.map((user) => user?.args._users).flat();

  useEffect(() => {
    if (data?.length) {
      const { eventName } = data[0];
      const newData = { ...watchData };
      switch (true) {
        case eventName === 'Unfollowed':
          newData.unfollowed = data;
          break;
        case eventName === 'Followed':
          newData.followed = data;
          break;
        case eventName === 'Unliked':
          newData.unliked = data;
          break;
        case eventName === 'Liked':
          newData.liked = data;
          break;
        case eventName === 'Unpinned':
          newData.unpinned = data;
          break;
        case eventName === 'Pinned':
          newData.pinned = data;
          break;
        case eventName === 'ArticlePosted':
          newData.articlesPosted = data;
          break;
        case eventName === 'MessageSended':
          newData.messages = data;
          break;
        case eventName === 'Comment':
          newData.commentPosted = data;
          break;
        default:
          break;
      }
      refresh();
      setWatchData(newData);
    }
  }, [data?.[0]?.blockNumber, data?.[0]?.transactionHash, setWatchData]);

  const allProfiles = [...UpdatePseudo, ...watchData.profiles];
  const profiles = allProfiles.reduce(
    (acc: objectType, cur: any) => ({
      ...acc,
      [`profile-${cur?.args._user}`]: cur?.args._pseudo,
    }),
    {}
  );

  useEffect(() => {
    setCompleteData({
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
    });
  }, [
    isConnected,
    isOwner,
    users.length,
    allComments.length,
    allArticles.length,
    articles.length,
    comments.length,
    followedArticles.length,
    follows.length,
    allLikes.length,
    likes.length,
    allPins.length,
    pins.length,
    messages.length,
    JSON.stringify(profiles),
  ]);

  return (
    <ContractContext.Provider
      value={{
        ...completeData,
        users,
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
