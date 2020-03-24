"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _getJSWrapper = _interopRequireDefault(require("./getJSWrapper"));

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Direct Import React
// We have to do it this way to permit SSR react + hooks
var ReactDOMServer = require(_path.default.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

var strapWithLambda = function strapWithLambda(name, component, config, method) {
  return function (event, context) {
    var queryStringParameters = event.queryStringParameters,
        body = event.body;
    var httpQuery = queryStringParameters === null ? {} : queryStringParameters;
    var httpBody = body === null ? {} : JSON.stringify(body);

    var props = _objectSpread({}, httpQuery, {}, httpBody);

    return {
      headers: {
        'content-type': 'application/javascript',
        expires: '-1',
        'cache-control': 'private, no-cache, no-store, must-revalidate',
        pragma: 'no-cache'
      },
      contentType: 'text',
      body: (0, _getJSWrapper.default)(name, config, props, ReactDOMServer.renderToString((0, _react.createElement)(component, props))),
      status: 200
    };
  };
};

var _default = strapWithLambda;
exports.default = _default;