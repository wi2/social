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
  CustomLogFollowArgsType,
  CustomLogMessageArgsType,
  CustomLogProfileArgsType,
  CustomLogType,
  CustomLogUserArgsType,
} from '../constants/type';
import {
  getArticles,
  getFollowers,
  getLikes,
  getMessages,
  getPins,
} from '../utils/contract';
import { Address, useAccount } from 'wagmi';
import useWatchAll from '../hooks/useWatchAll';

type objectType = { [k: Address]: string };

interface ContractContextType {
  isConnected: boolean;
  isOwner: boolean;
  // account
  users?: (Address | undefined)[];
  // network
  allArticles?: CustomLogType<CustomLogArticleArgsType>[];
  articles?: CustomLogType<CustomLogArticleArgsType>[];
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
    messages: [],
    profiles: [],
  });
  const data = useWatchAll();

  const { address } = useAccount();
  const isConnected = useIsConnected();
  const isOwner = useIsOwner();
  // account
  const UsersCreated = useWatch<CustomLogUserArgsType>(
    jsonFiles[JSON_FILES.account].abi.find(
      ({ name, type }) => name === 'UsersCreated' && type === 'event'
    )
  );

  // profile
  const UpdatePseudo = useWatch<CustomLogProfileArgsType>(
    jsonFiles[JSON_FILES.profile].abi.find(
      ({ name, type }) => name === 'UpdatePseudo' && type === 'event'
    )
  );

  // messenger
  const MessageSended = useWatch<CustomLogMessageArgsType>(
    jsonFiles[JSON_FILES.messenger].abi.find(
      ({ name, type }) => name === 'MessageSended' && type === 'event'
    )
  );

  // network
  const articlesPosted = useWatch<CustomLogArticleArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'ArticlePosted' && type === 'event'
    )
  );

  const followed = useWatch<CustomLogFollowArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'Followed' && type === 'event'
    )
  );

  const unfollowed = useWatch<CustomLogFollowArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'Unfollowed' && type === 'event'
    )
  );

  const liked = useWatch<CustomLogActionArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'Liked' && type === 'event'
    )
  );

  const unliked = useWatch<CustomLogActionArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'Unliked' && type === 'event'
    )
  );

  const pinned = useWatch<CustomLogActionArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'Pinned' && type === 'event'
    )
  );
  const unpinned = useWatch<CustomLogActionArgsType>(
    jsonFiles[JSON_FILES.network].abi.find(
      ({ name, type }) => name === 'Unpinned' && type === 'event'
    )
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
  ]);

  const articles = allArticles.filter(
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
        case eventName === 'ArticlesPosted':
          newData.articlesPosted = data;
          break;
        case eventName === 'MessageSended':
          newData.messages = data;
          break;

        default:
          break;
      }
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
    allArticles.length,
    articles.length,
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
