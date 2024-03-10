export const socialAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SlugNameAlreadyExist',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: '_slug',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'Create',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_slug',
        type: 'string',
      },
      {
        internalType: 'address[]',
        name: '_to',
        type: 'address[]',
      },
      {
        internalType: 'bytes32',
        name: '_merkleRoot',
        type: 'bytes32',
      },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_slug',
        type: 'string',
      },
    ],
    name: 'getProject',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'network',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'messenger',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'profile',
            type: 'address',
          },
        ],
        internalType: 'struct Social.Project',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_slug',
        type: 'string',
      },
    ],
    name: 'getProjectName',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const socialAccountAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_to',
        type: 'address[]',
      },
      {
        internalType: 'bytes32',
        name: '_merkleRoot',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'OnlyAdmin',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: '_users',
        type: 'address[]',
      },
    ],
    name: 'UsersCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_to',
        type: 'address[]',
      },
      {
        internalType: 'bytes32',
        name: '_merkleRoot',
        type: 'bytes32',
      },
    ],
    name: 'addMoreUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum SocialAccount.Services',
        name: '_service',
        type: 'uint8',
      },
    ],
    name: 'isServiceActive',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'isUser',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'merkleRoot',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'toggleServices',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'users',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const socialNetworkAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_socialTokenAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AlreadyFollowed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyLiked',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyPinned',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyUnfollowed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyUnliked',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyUnpinned',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyService',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyUser',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_author',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
    ],
    name: 'ArticlePosted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cidArticle',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
    ],
    name: 'Comment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_me',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_userFollow',
        type: 'address',
      },
    ],
    name: 'Followed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_me',
        type: 'address',
      },
    ],
    name: 'Liked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_me',
        type: 'address',
      },
    ],
    name: 'Pinned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_me',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_userFollow',
        type: 'address',
      },
    ],
    name: 'Unfollowed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_me',
        type: 'address',
      },
    ],
    name: 'Unliked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_me',
        type: 'address',
      },
    ],
    name: 'Unpinned',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'follow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'getLastArticleFrom',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'getLastCommentByArticle',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyLastArticle',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'isFollowed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
    ],
    name: 'isPinned',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'like',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'likes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'likes',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'pin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'postArticle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_articleCid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'postComment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'unfollow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'unlike',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'unpin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const socialMessengerAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_socialTokenAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'OnlyService',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyUser',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'BurnChat',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_cid',
        type: 'bytes32',
      },
    ],
    name: 'MessageSended',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'burnChat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'getCurrentCID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_newCid',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const socialProfileAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_socialTokenAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'OnlyService',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyUser',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'CreateProfile',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_pseudo',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'UpdatePseudo',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'UpdateStatus',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyProfile',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'pseudo',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'status',
            type: 'bool',
          },
        ],
        internalType: 'struct SocialProfile.User',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_pseudo',
        type: 'string',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'updatePseudo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
      {
        internalType: 'bytes32[]',
        name: '_proof',
        type: 'bytes32[]',
      },
    ],
    name: 'updateStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
