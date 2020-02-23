"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MicroUIComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Hooks = require("../Hooks");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MicroUIComponent = function MicroUIComponent(props) {
  var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _react.default.createElement("div", null);
  // Deconstruct the micro UI component values
  var _props$microUi = props.microUi,
      url = _props$microUi.url,
      library = _props$microUi.library,
      name = _props$microUi.name; // We need to have a ref, this will be the component the micro UI's internal reactDomRender will render into

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      ref = _useState2[0],
      setRef = _useState2[1]; // Invoke the custom micro UI hook to retrieve the mounting callback and the loading state
  // It does not matter if we have several components attempting to load the same micro UI, it will only load the assets once


  var _useMicroUI = (0, _Hooks.useMicroUI)(url, library),
      _useMicroUI2 = _slicedToArray(_useMicroUI, 2),
      render = _useMicroUI2[0],
      loaded = _useMicroUI2[1]; // Once we have a ref and the micro ui reports as loaded then proceed to load in our component


  if (ref && loaded) {
    // Pass in our container ref, the name of the exported micro UI component we want to render and the props for that component
    render(ref, name, props);
  } // Return out a div to embed within
  // @TODO make this


  return _react.default.createElement("el", {
    ref: setRef
  });
};

exports.MicroUIComponent = MicroUIComponent;
var _default = MicroUIComponent;
exports.default = _default;