"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _getJSWrapper = _interopRequireDefault(require("./getJSWrapper"));

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(_path.default.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const strapWithLambda = (name, component, config, method) => (event, context) => {
  const {
    queryStringParameters,
    body
  } = event;
  const httpQuery = queryStringParameters && queryStringParameters === null ? {} : queryStringParameters;
  const httpBody = body && body === null ? {} : JSON.stringify(body);
  const props = { ...httpQuery,
    ...httpBody
  };
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

var _default = strapWithLambda;
exports.default = _default;