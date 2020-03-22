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
var ReactDOMServer = require(_path.default.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

var strapWithExpress = function strapWithExpress(name, component, config, method) {
  return function (req, res) {
    res.send((0, _getJSWrapper.default)(name, config, method === 'GET' ? req.query : req.body, ReactDOMServer.renderToString((0, _react.createElement)(component, method === 'GET' ? req.query : req.body))));
  };
};

var _default = strapWithExpress;
exports.default = _default;