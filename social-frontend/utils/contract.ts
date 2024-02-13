import { Address, keccak256 } from 'viem';
import MerkleTree from 'merkletreejs';
import {
  CustomError,
  CustomLogActionArgsType,
  CustomLogArticleArgsType,
  CustomLogFollowArgsType,
  CustomLogType,
} from '../constants/type';
import { P } from '@wagmi/core/dist/index-e744bbc2';

export function getErrorMsg(error: CustomError) {
  const cause = error.cause as { reason: string };
  return (
    cause?.reason ||
    error.shortMessage ||
    error.message ||
    'An internal error was received'
  );
}

export async function watchEvents(client: P, event: any, cb: any) {
  const allLogs = await client.watchEvent({
    onLogs: (logs) => console.log(logs),
  });
  cb(allLogs);
}

export async function getEvents<S>(client: P, event: any, cb: any) {
  const logs = (await client.getLogs({
    event,
    fromBlock: BigInt(0),
    toBlock: 'latest', // Pas besoin valeur par défaut
  })) as CustomLogType<S>[];
  console.log('>>>', event, logs);
  cb(logs);
}

export function getTree(users: Address[]) {
  const leaves = users.map((address) => keccak256(address));
  return new MerkleTree(leaves, keccak256, { sort: true });
}

export function getHexProof(users: Address[], user: Address | undefined) {
  const tree = getTree(users);
  const leaf = keccak256(user as Address);
  return tree.getHexProof(leaf) as Address[];
}

export function getEventSorted<T>(
  first: CustomLogType<T>[],
  second: CustomLogType<T>[]
) {
  const unique = [...first, ...second].reduce<CustomLogType<T>[]>(
    (accumulator, current) => {
      if (
        !accumulator.find((item: any) => item.blockHash === current?.blockHash)
      ) {
        accumulator.push(current);
      }
      return accumulator;
    },
    []
  );

  return unique.sort((a: CustomLogType<T>, b: CustomLogType<T>) => {
    const blockNumberA = a?.blockNumber as bigint;
    const blockNumberB = b?.blockNumber as bigint;
    return blockNumberA > blockNumberB ? 1 : -1;
  });
}

export function getFollowers<T = CustomLogFollowArgsType>(
  followed: CustomLogType<T>[],
  unfollowed: CustomLogType<T>[],
  user: Address | undefined
) {
  const finalMap = new Map();
  getEventSorted<T>(followed, unfollowed)
    .filter(
      (item: CustomLogType<T>) =>
        (item as CustomLogType<CustomLogFollowArgsType>)?.args._me === user
    )
    .forEach((item: CustomLogType<T>) => {
      const itemType = item as CustomLogType<CustomLogFollowArgsType>;
      if (itemType) {
        const _userFollow = itemType.args._userFollow;
        if (itemType.eventName === 'Followed') {
          finalMap.set(_userFollow, item);
        } else if (itemType.eventName === 'Unfollowed') {
          finalMap.delete(_userFollow);
        }
      }
    });
  return Array.from(finalMap.values());
}

export function getLikes<T = CustomLogActionArgsType>(
  liked: CustomLogType<T>[],
  unliked: CustomLogType<T>[],
  user: Address | undefined
) {
  const finalMap = new Map();
  getEventSorted<T>(liked, unliked)
    .filter(
      (item) =>
        (item as CustomLogType<CustomLogActionArgsType>)?.args._me === user
    )
    .forEach((item) => {
      const itemType = item as CustomLogType<CustomLogActionArgsType>;
      if (itemType) {
        const { _cid } = itemType.args;
        if (itemType.eventName === 'Liked') {
          finalMap.set(_cid, itemType);
        } else if (itemType.eventName === 'Unliked') {
          finalMap.delete(_cid);
        }
      }
    });
  return Array.from(finalMap.values());
}

export function getPins<T = CustomLogActionArgsType>(
  pinned: CustomLogType<T>[],
  unpinned: CustomLogType<T>[],
  user: Address | undefined
) {
  const finalMap = new Map();
  getEventSorted(pinned, unpinned)
    .filter(
      (item) =>
        (item as CustomLogType<CustomLogActionArgsType>)?.args._me === user
    )
    .forEach((item) => {
      const itemType = item as CustomLogType<CustomLogActionArgsType>;
      if (itemType) {
        const { _cid } = itemType.args;
        if (itemType.eventName === 'Pinned') {
          finalMap.set(_cid, item);
        } else if (itemType.eventName === 'Unpinned') {
          finalMap.delete(_cid);
        }
      }
    });
  return Array.from(finalMap.values());
}

export function getArticles<T = CustomLogArticleArgsType>(
  articlesPosted: CustomLogType<T>[],
  user: Address | undefined
) {
  const finalMap = new Map();
  getEventSorted(articlesPosted, [])
    .filter(
      (item) =>
        (item as CustomLogType<CustomLogArticleArgsType>)?.args._author === user
    )
    .forEach((item) => {
      const itemType = item as CustomLogType<CustomLogActionArgsType>;
      if (itemType) {
        const { _cid } = itemType.args;
        if (itemType.eventName === 'ArticlePosted') {
          finalMap.set(_cid, itemType);
        }
      }
    });
  return Array.from(finalMap.values());
}