import configureStore from 'redux-mock-store';
import { schema } from 'normalizr';

import normalizeAxiosMiddleware from './';

describe('normalize middleware', () => {
  const mockStore = configureStore([normalizeAxiosMiddleware]);
  const store = mockStore();

  afterEach(() => {
    store.clearActions();
  });

  const response = {
    data: [
      {
        id: 1,
        title: 'Article 1',
        author: {
          id: 10,
          name: 'John',
        },
      },
      {
        id: 2,
        title: 'Article 2',
        author: {
          id: 20,
          name: 'Alex',
        },
      },
    ],
  };

  const responseWithNestedData = {
    data: { items: response.data }
  };

  const authorSchema = new schema.Entity('authors');
  const articlesSchema = [new schema.Entity('articles', {
    author: authorSchema,
  })];

  const action = {
    type: 'success',
    payload: response,
    meta: {
      previousAction: {
        normalize: {
          schema: articlesSchema,
        }
      },
    },
  };

  const actionWithPath = {
    type: 'success',
    payload: responseWithNestedData,
    meta: {
      previousAction: {
        normalize: {
          schema: articlesSchema,
          path: 'items'
        }
      },
    },
  }

  const normalizedArticles = {
    1: {
      id: 1,
      title: 'Article 1',
      author: 10,
    },
    2: {
      id: 2,
      title: 'Article 2',
      author: 20,
    },
  };

  const normalizedAuthors =  {
    10: {
      id: 10,
      name: 'John',
    },
    20: {
      id: 20,
      name: 'Alex',
    },
  };

  it('should normalize items according to schema', () => {
    store.dispatch(action);
    expect(store.getActions()[0].payload.data.articles.items).toEqual(normalizedArticles);
    expect(store.getActions()[0].payload.data.authors.items).toEqual(normalizedAuthors);
  });

  it('should include ids of items', () => {
    store.dispatch(actionWithPath);
    expect(store.getActions()[0].payload.data.articles.allIds).toEqual([1, 2]);
    expect(store.getActions()[0].payload.data.authors.allIds).toEqual([10, 20]);
  });

  it('should normalize data from path', () => {
    store.dispatch(action);
    expect(store.getActions()[0].payload.data.articles.items).toEqual(normalizedArticles);
    expect(store.getActions()[0].payload.data.authors.items).toEqual(normalizedAuthors);
  })

  it('should not try to normalize data if no schema provided', () => {
    const actionWithoutSchema = {
      type: 'success',
      payload: response,
    };

    store.dispatch(actionWithoutSchema);
    expect(store.getActions()[0]).toEqual(actionWithoutSchema);
  });

  it('should not try to normalize data if no payload provided', () => {
    const actionWithoutSchema = {
      type: 'success',
      meta: {
        previousAction: {
          schema: articlesSchema,
        },
      },
    };

    store.dispatch(actionWithoutSchema);
    expect(store.getActions()[0]).toEqual(actionWithoutSchema);
  });
});
