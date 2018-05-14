'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _normalizr = require('normalizr');

var _lodash = require('lodash');

var shouldNormalizeAction = function shouldNormalizeAction(action) {
  return (0, _lodash.has)(action, 'payload.data') && (0, _lodash.has)(action, 'meta.previousAction.normalize.schema');
};

var appendAllIds = function appendAllIds(data) {
  return (0, _lodash.mapValues)(data.entities, function (entity) {
    return { items: entity, allIds: (0, _lodash.map)(entity, function (item) {
        return item.id;
      }) };
  });
};

exports.default = function (store) {
  return function (next) {
    return function (action) {
      if (!shouldNormalizeAction(action)) return next(action);

      var data = action.payload.data;
      var schema = action.meta.previousAction.normalize.schema;
      var path = (0, _lodash.get)(action.meta.previousAction.normalize, 'path');

      var requestData = path ? (0, _lodash.get)(data, path) : data;
      var normalizedData = (0, _normalizr.normalize)(requestData, schema);
      var normalizedDataWithAllIds = appendAllIds(normalizedData);
      return next(_extends({}, action, {
        payload: _extends({}, action.payload, {
          data: normalizedDataWithAllIds
        })
      }));
    };
  };
};
