"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hydrateComponent = function hydrateComponent(Components) {
  return function (containerEl, name, props) {
    var Comp = Components[name];
    (0, _reactDom.hydrate)(_react.default.createElement(Comp, props), containerEl);
  };
};

var _default = hydrateComponent;
exports.default = _default;