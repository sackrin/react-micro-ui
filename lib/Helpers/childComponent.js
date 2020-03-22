"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var childComponent = function childComponent(components) {
  return function (name, props) {
    var Comp = components[name];
    return Comp && _react.default.createElement(Comp, props);
  };
};

var _default = childComponent;
exports.default = _default;