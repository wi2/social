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
  CustomLogType,
  CustomLogUserArgsType,
} from '../constants/type';
import {
  getArticles,
  getFollowers,
  getLikes,
  getPins,
} from '../utils/contract';
import { useAccount } from 'wagmi';
import useWatchAll from '../hooks/useWatchAll';

interface ContractContextType {
  isConnected: boolean;
  isOwner: boolean;
  // account
  users?: CustomLogType<CustomLogUserArgsType>[];
  // network
  articles?: CustomLogType<CustomLogArticleArgsType>[];
  follows?: CustomLogType<CustomLogFollowArgsType>[];
  followedArticles?: CustomLogType<CustomLogArticleArgsType>[];
  likes?: CustomLogType<CustomLogActionArgsType>[];
  pins?: CustomLogType<CustomLogActionArgsType>[];
  messages?: CustomLogType<CustomLogMessageArgsType>[];
}

export const ContractContext = createContext<ContractContextType>({
  isConnected: false,
  isOwner: false,
});

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [watchData, setWatchData] = useState({
    unfollowed: [],
    followed: [],
    liked: [],
    unliked: [],
    pinned: [],
    unpinned: [],
    articlesPosted: [],
    messages: [],
  });
  const data = useWatchAll();

  const { address } = useAccount();
  const isConnected = useIsConnected();
  const isOwner = useIsOwner();
  // account
  const users = useWatch<CustomLogUserArgsType>(
    jsonFiles[JSON_FILES.account].abi.find(
      ({ name, type }) => name === 'UsersCreated' && type === 'event'
    )
  );

  // messenger
  const messages = useWatch<CustomLogMessageArgsType>(
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

  const follows = getFollowers(
    [...followed, ...watchData.followed],
    [...unfollowed, ...watchData.unfollowed],
    address
  );
  const likes = getLikes(
    [...liked, ...watchData.liked],
    [...unliked, ...watchData.unliked],
    address
  );
  const pins = getPins(
    [...pinned, ...watchData.pinned],
    [...unpinned, ...watchData.unpinned],
    address
  );
  const articles = getArticles(
    [...articlesPosted, ...watchData.articlesPosted],
    address
  );
  const followedArticles = follows
    .map((follow) => follow.args._userFollow)
    .map((addr) => getArticles(articlesPosted, addr))
    .flat();

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
  }, [data?.[0]?.blockNumber, setWatchData]);

  return (
    <ContractContext.Provider
      value={{
        isConnected,
        isOwner,
        users,
        articles,
        followedArticles,
        follows,
        likes,
        pins,
        messages: [...messages, ...watchData.messages].flat(),
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
