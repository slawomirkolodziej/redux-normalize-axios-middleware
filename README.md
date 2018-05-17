# Redux Normalize Axios Middleware

Normalize data using [redux-axios-middleware](https://github.com/svrcekmichal/redux-axios-middleware) and [normalizr](https://github.com/paularmstrong/normalizr) schema

## Installation
`yarn add redux-normalize-axios-middleware redux-axios-middleware normalizr`

## Usage
Add normalizeAxiosMiddleware
```js
import normalizeAxiosMiddleware from 'redux-normalize-axios-middleware'

const store = createStore(testReducer, applyMiddleware(
  axiosMiddleware(axiosClient),
  normalizeAxiosMiddleware
))
```

Add [normalizr](https://github.com/paularmstrong/normalizr) schema to your action:
```js
import { schema } from 'normalizr'

const fetchPosts = () => ({
  type: 'FETCH_POSTS',
  payload: {
    request: {
      url: API_URL
    }
  },
  normalize: {
    schema: new schema.Entity('posts'),
  }
})
```

This will normalize data and include ids of items:
```js
{
  data: {
    posts: {
      items: { 1: { id: 1, title: 'title' } },
      allIds: [1],
    }
  },
  ...remainingAxiosData
}
```

If your data is nested you can use `path` option to specify what should be normalized. The remaining part of data outside of `path` will be omitted. `path` uses [lodash/get](https://lodash.com/docs/4.17.10#get) format:
```js
import { schema } from 'normalizr'

const fetchPosts = () => ({
  type: 'FETCH_POSTS',
  payload: {
    request: {
      url: API_URL
    }
  },
  normalize: {
    schema: [new schema.Entity('posts')],
    path: 'allPosts'
  }
})
```
This will normalize:
```js
{
  allPosts: [{
    id: 1,
    title: 'title'
  }],
  someOtherData: 'lorem ipsum',
}
```
To:
```js
{
  posts: {
    items: { 1: { id: 1, title: 'title' } },
    allIds: [1],
  }
}
```
