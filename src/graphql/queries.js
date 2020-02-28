/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncPosts = /* GraphQL */ `
  query SyncPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        comments {
          nextToken
          startedAt
        }
        rating
        status
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      comments {
        items {
          id
          content
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      rating
      status
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        comments {
          nextToken
          startedAt
        }
        rating
        status
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncComments = /* GraphQL */ `
  query SyncComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        content
        post {
          id
          title
          rating
          status
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      content
      post {
        id
        title
        comments {
          nextToken
          startedAt
        }
        rating
        status
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        post {
          id
          title
          rating
          status
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncQuotes = /* GraphQL */ `
  query SyncQuotes(
    $filter: ModelQuoteFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncQuotes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        quoteNumber
        quoteName
        expirationDate
        customerPoNumber
        description
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getQuote = /* GraphQL */ `
  query GetQuote($id: ID!) {
    getQuote(id: $id) {
      id
      quoteNumber
      quoteName
      expirationDate
      customerPoNumber
      description
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listQuotes = /* GraphQL */ `
  query ListQuotes(
    $filter: ModelQuoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        quoteNumber
        quoteName
        expirationDate
        customerPoNumber
        description
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
