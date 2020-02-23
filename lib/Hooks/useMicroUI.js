"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
  useMicroUI Hook
  Use this hook to embed a micro UI component into a primary application
  the hook will handle both loading the library and returning the callbacks to render micro UI components
  @param baseUrl = the url to the micro UI ie http://examplemicroui.com
  @param libraryName = the UMD library name
 */
function useMicroUI(baseUrl, libraryName) {
  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      libraryLoaded = _useState2[0],
      setLibraryLoaded = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      bootstrapLoaded = _useState4[0],
      setBootstrapLoaded = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      bootstrapError = _useState6[0],
      setBootstrapError = _useState6[1]; // Checks if the micro UI script is present


  var hasBootstrapScript = (0, _react.useCallback)(function () {
    // We want to check for both the script and the window object
    // This is in case the script was included somewhere without the id we expect
    return !!document.getElementById("".concat(libraryName, "Library")) || window[libraryName];
  }, [baseUrl, libraryName]); // Loads the micro UI script

  var addBootstrapScript = (0, _react.useCallback)(function () {
    var tag = document.createElement('script');
    tag.id = "".concat(libraryName, "Library");
    tag.src = "".concat(baseUrl, "/bootstrap.js");

    tag.onload = function () {
      return setBootstrapLoaded(true);
    };

    tag.onerror = function (e) {
      return setBootstrapError(true);
    };

    document.getElementsByTagName('head')[0].appendChild(tag);
  }, [baseUrl, libraryName]); // Handle the micro UI emitting a loaded event

  var handleMicroUILoadEvent = (0, _react.useCallback)(function (e) {
    // Since all micro UIs emit a microUILoaded custom event we need to check this is the one we are after
    if (e.detail.name === libraryName) {
      setLibraryLoaded(true);
    }
  }, []); // Use the micro UI's exported render helper to render the actual component

  var renderComponent = (0, _react.useCallback)(function (ref, name, props) {
    if (window[libraryName] && window[libraryName].Render) {
      window[libraryName].Render(ref, name, props);
    }
  }, [libraryLoaded]); // Listen for the MicroUI to emit that it has fully loaded
  // This has to happen in order to allow for the micro UI to load all assets within the manifest

  (0, _react.useEffect)(function () {
    // If the library has already been detected as loaded and has environment vars
    if (window[libraryName] && window["__MicroUI".concat(libraryName, "AssetURL__")]) {
      setLibraryLoaded(true);
    } // Setup the listener against the window event space AND return a cleanup event remover


    window.addEventListener('microUILoaded', handleMicroUILoadEvent);
    return function () {
      window.removeEventListener('microUILoaded', handleMicroUILoadEvent);
    };
  }, []); // If the library bootstrap has not been detected then we have to initiate the script loading
  // This is where the bootstrap.js is loaded and not the actual assets within manifest.js
  // Manifest.js assets are loaded within the bootstrap.js and a custom microUILoaded window event is emitted on completion

  if (!bootstrapLoaded && !bootstrapError && !hasBootstrapScript()) {
    addBootstrapScript();
  } // If the library is loaded then return the render helper, the various loaded flags and the library itself
  // Otherwise return all nulls and falses


  return libraryLoaded ? [renderComponent, libraryLoaded, setBootstrapLoaded, setBootstrapError, window[libraryName]] : [null, false, false, false, null];
}

var _default = useMicroUI;
exports.default = _default;