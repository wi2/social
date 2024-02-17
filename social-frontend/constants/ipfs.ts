const now = new Date();

export const article = {
  metadata: {
    historic: [], // liste of all CID article from previous to oldest
    timestamp: now.getTime(),
  },

  author: {
    // author of the article
    name: '',
    address: undefined,
  },

  retweet: {
    author: '',
    address: '',
    cid: '',
  },
  title: '',
  content: '',
};

const comment = {
  metadata: {
    parent: '',
    article: '', // cid article
    timestamp: '',
  },

  author: {
    // author of the comment
    name: '',
    address: '',
  },

  comment: '',
};

export const messageTemplate = {
  metadata: {
    parent: '', // previous CID message
    timestamp: '',
  },

  from: {
    name: '',
    address: '',
  },

  to: {
    name: '',
    address: '',
  },

  content: '',
};
