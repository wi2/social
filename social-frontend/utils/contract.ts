import { Address, fromBytes, isAddress, keccak256, zeroAddress } from 'viem';
import MerkleTree from 'merkletreejs';
import {
  CustomError,
  CustomLogActionArgsType,
  CustomLogArticleArgsType,
  CustomLogCommentArgsType,
  CustomLogFollowArgsType,
  CustomLogMessageArgsType,
  CustomLogType,
} from '../constants/type';
import { P } from '@wagmi/core/dist/index-e744bbc2';
import base58 from 'bs58';

export function getErrorMsg(error: CustomError) {
  const cause = error.cause as { reason: string };
  return (
    cause?.reason ||
    error.shortMessage ||
    error.message ||
    'An internal error was received'
  );
}

export async function getEvents<S>(client: P, event: any, cb: any) {
  const logs = (await client.getLogs({
    event,
    fromBlock: BigInt(0),
    toBlock: 'latest', // Pas besoin valeur par défaut
  })) as CustomLogType<S>[];
  cb(logs);
}

export function getTree(users: Address[]) {
  const leaves = users
    .filter((address) => isAddress(address))
    .map((address) => keccak256(address));
  return new MerkleTree(leaves, keccak256, { sort: true });
}

export function getHexProof(users: Address[], user: Address | undefined) {
  const tree = getTree(users);
  const leaf = keccak256((user || zeroAddress) as Address);
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

export function getMessages<T = CustomLogMessageArgsType>(
  messages: CustomLogType<T>[],
  user: Address | undefined
) {
  const finalMap = new Map();
  messages
    .filter(
      (item: CustomLogType<T>) =>
        (item as CustomLogType<CustomLogMessageArgsType>)?.args._from ===
          user ||
        (item as CustomLogType<CustomLogMessageArgsType>)?.args._to === user
    )
    .forEach((item: CustomLogType<T>) => {
      finalMap.set(item?.transactionHash, item);
    });
  return Array.from(finalMap.values());
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
        const { _userFollow } = itemType.args;
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
  unliked: CustomLogType<T>[]
) {
  const finalMap = new Map();
  getEventSorted<T>(liked, unliked).forEach((item) => {
    const itemType = item as CustomLogType<CustomLogActionArgsType>;
    if (itemType) {
      const { _cid, _me } = itemType.args;
      if (itemType.eventName === 'Liked') {
        finalMap.set(`${_me}${_cid}`, itemType);
      } else if (itemType.eventName === 'Unliked') {
        finalMap.delete(`${_me}${_cid}`);
      }
    }
  });
  return Array.from(finalMap.values());
}

export function getPins<T = CustomLogActionArgsType>(
  pinned: CustomLogType<T>[],
  unpinned: CustomLogType<T>[]
) {
  const finalMap = new Map();
  getEventSorted(pinned, unpinned).forEach((item) => {
    const itemType = item as CustomLogType<CustomLogActionArgsType>;
    if (itemType) {
      const { _cid, _me } = itemType.args;
      if (itemType.eventName === 'Pinned') {
        finalMap.set(`${_me}${_cid}`, item);
      } else if (itemType.eventName === 'Unpinned') {
        finalMap.delete(`${_me}${_cid}`);
      }
    }
  });
  return Array.from(finalMap.values());
}

export function getArticles<T = CustomLogArticleArgsType>(
  articlesPosted: CustomLogType<T>[]
) {
  const finalMap = new Map();
  getEventSorted(articlesPosted, []).forEach((item) => {
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

export function getComments<T = CustomLogCommentArgsType>(
  comments: CustomLogType<T>[]
) {
  const finalMap = new Map();
  getEventSorted(comments, []).forEach((item) => {
    const itemType = item as CustomLogType<CustomLogActionArgsType>;
    if (itemType) {
      const { _cid } = itemType.args;
      if (itemType.eventName === 'Comment') {
        finalMap.set(_cid, itemType);
      }
    }
  });
  return Array.from(finalMap.values());
}

export function cidToHex(_cid: Address) {
  return fromBytes(base58.decode(_cid).slice(2), 'hex') as unknown as
    | Address
    | undefined;
}
