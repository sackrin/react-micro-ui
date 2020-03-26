"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const renderComponent = (render, components) => (containerEl, name, props) => {
  const Comp = components[name];
  render(_react.default.createElement(Comp, props), containerEl);
};

var _default = renderComponent;
exports.default = _default;