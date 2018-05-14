import { normalize } from 'normalizr';
import { has, mapValues, keys } from 'lodash';

export default store => next => action => {
  if (has(action, 'payload.data') && has(action, 'meta.previousAction.schema')) {
    const normalizedData = normalize(action.payload.data, action.meta.previousAction.schema);
    const normalizedDataWithIds = mapValues(normalizedData.entities, entity => (
      { items: entity, allIds: keys(entity) }
    ));
    return next({
      ...action,
      payload: {
        ...action.payload,
        data: normalizedDataWithIds,
      }
    });
  }

  return next(action);
};
