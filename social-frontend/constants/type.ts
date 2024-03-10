export enum Theme {
  dark = 'dark',
  light = 'light',
}

import { Address, Log } from 'viem';
import { ABIS } from './contract';
import {
  socialAbi,
  socialAccountAbi,
  socialMessengerAbi,
  socialNetworkAbi,
  socialProfileAbi,
} from './abi';

export type AppAbiType =
  | typeof socialAccountAbi
  | typeof socialMessengerAbi
  | typeof socialNetworkAbi
  | typeof socialProfileAbi
  | typeof socialAbi;

export type OnSuccess = () => void;
export type OnError = (error: string) => void;

export type addressType = `0x${string}` | undefined;

export type CustomError = Error & { shortMessage?: string };

export enum CustomToastType {
  warning = 'warning',
  info = 'info',
  success = 'success',
  error = 'error',
}

export type CustomToast = {
  type: CustomToastType;
  content: string;
};

export type ProjectTypeServices = {
  [k in ABIS]: Address;
};

export type ProfileType = { pseudo: string };

export type ProjectType = ProjectTypeServices & {
  name: string;
  owner: Address;
};

export type CustomLogType<S = unknown> =
  | (Log & { args: S; eventName: string; blockHash?: Address })
  | undefined;

export type CreateProjectType = {
  name: string;
  slug: string;
  adresses: addressType;
};

export type metadataArticleType = {
  historic: Address[];
  timestamp: number;
};
export type authorType = {
  name: string;
  address: string;
};
export type retweetType = {
  author: string;
  address: string;
  cid: string;
};

export type ArticleType = {
  metadata: metadataArticleType;
  author: authorType;
  retweet: retweetType;
  title: string;
  content: string;
};

export type metadataCommentType = {
  parent: string;
  article: string;
  timestamp: number;
};

export type CommentType = {
  metadata: metadataCommentType;
  author: authorType;
  comment: string;
};

export type metadataMessageType = {
  parent: string;
  timestamp: number;
};

export type MessageAuthorType = {
  name: string;
  address: string;
};

export type MessageTemplate = {
  metadata: metadataMessageType;
  from: MessageAuthorType;
  to: MessageAuthorType;
  content: string;
};

export type CustomLogFollowArgsType = {
  _userFollow: Address;
  _me: Address;
};

export type CustomLogActionArgsType = {
  _me: Address;
  _cid: Address;
};

export type CustomLogArticleArgsType = {
  _author: Address;
  _cid: Address;
};

export type CustomLogCommentArgsType = {
  _cidArticle: Address;
  _cid: Address;
};

export type CustomLogUserArgsType = {
  _users: Address[];
};

export type CustomLogProfileArgsType = {
  [k: `profile-${Address | string}`]: Address;
};

export type CustomLogInitialProfileArgsType = {
  _user: Address;
  _pseudo: string;
};

export type CustomLogMessageArgsType = {
  _from: Address;
  _to: Address;
  _cid: Address;
};

export type MetadataTemplate = {
  parent: Address;
  article: Address; // cid article
  timestamp: number;
};
export type MetadataArticleTemplate = {
  historic: Address[];
  timestamp: number;
};

export type RetweetTemplate = {
  author: string;
  address: Address;
  cid: Address;
};

export type AuthorTemplate = {
  name: string;
  address: Address | undefined;
};

export type ArticleTemplate = {
  metadata: MetadataArticleTemplate;
  author: AuthorTemplate;
  title: string;
  content: string;
  retweet?: RetweetTemplate;
};

export type MetadataCommentTemplate = {
  historic: Address[];
  timestamp: number;
  cid?: Address;
};

export type CommentTemplate = {
  metadata: MetadataCommentTemplate;
  author: AuthorTemplate;
  content: string;
};
