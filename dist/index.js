'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _normalizr = require('normalizr');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _has = require('lodash/has');

var _has2 = _interopRequireDefault(_has);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shouldNormalizeAction = function shouldNormalizeAction(action) {
  return (0, _has2.default)(action, 'payload.data') && (0, _has2.default)(action, 'meta.previousAction.normalize.schema');
};

var appendAllIds = function appendAllIds(data) {
  return (0, _mapValues2.default)(data.entities, function (entity) {
    return { items: entity, allIds: (0, _map2.default)(entity, function (item) {
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
      var path = (0, _get2.default)(action.meta.previousAction.normalize, 'path');

      var requestData = path ? (0, _get2.default)(data, path) : data;
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
