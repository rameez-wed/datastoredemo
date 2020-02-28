/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateQuote = /* GraphQL */ `
  subscription OnCreateQuote {
    onCreateQuote {
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
export const onUpdateQuote = /* GraphQL */ `
  subscription OnUpdateQuote {
    onUpdateQuote {
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
export const onDeleteQuote = /* GraphQL */ `
  subscription OnDeleteQuote {
    onDeleteQuote {
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
