import { normalize } from 'normalizr';
import { has, mapValues, keys } from 'lodash';

const shouldNormalizeAction = action => (
  has(action, 'payload.data') && has(action, 'meta.previousAction.schema')
);

const appendAllIds = data => mapValues(data.entities, entity => (
  { items: entity, allIds: keys(entity) }
));

export default store => next => action => {
  if(!shouldNormalizeAction(action)) return next(action);

  const normalizedData = normalize(action.payload.data, action.meta.previousAction.schema);
  const normalizedDataWithAllIds = appendAllIds(normalizedData);
  return next({
    ...action,
    payload: {
      ...action.payload,
      data: normalizedDataWithAllIds,
    }
  });
};
