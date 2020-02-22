"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _react = require("react");

var _express = _interopRequireWildcard(require("express"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _compression = _interopRequireDefault(require("compression"));

var _Handlers = require("./Handlers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Direct Import React
// We have to do it this way to permit SSR react + hooks
var ReactDOMServer = require(_path.default.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

var createApi = function createApi(_ref) {
  var config = _ref.config,
      _ref$logger = _ref.logger,
      logger = _ref$logger === void 0 ? console : _ref$logger,
      _ref$port = _ref.port,
      port = _ref$port === void 0 ? 9000 : _ref$port;

  // Attempt to start the express server
  try {
    // Saying hello
    logger.info('API starting'); // Create a new express instance

    var api = (0, _express.default)(); // Setting up middlewares

    api.use((0, _express.json)());
    api.use((0, _helmet.default)());
    api.use((0, _cors.default)({
      origin: '*'
    }));
    api.use((0, _compression.default)());
    api.enable('trust proxy'); // Serve static assets

    api.use(_express.default.static('./.microui')); // Hydrate and output the bootstrapper script

    api.get('/bootstrap.js', (0, _Handlers.handleBootstrap)(config)); // Straps a component into the SSR api

    var strap = function strap(name, component) {
      // Handle a GET request to fetch a component
      api.get("/".concat(name), function (req, res) {
        res.send((0, _Handlers.getJSWrapper)(name, config, req.query, ReactDOMServer.renderToString((0, _react.createElement)(component, req.query))));
      }); // Handle a POST request to fetch a component

      api.post("/".concat(name), function (req, res) {
        res.send((0, _Handlers.getJSWrapper)(name, config, req.body, ReactDOMServer.renderToString((0, _react.createElement)(component, req.body))));
      });
    }; // Boots up the server


    var boot = function boot() {
      // Handle any 404 errors
      api.use(_Handlers.handleNotFound); // Start the server listening on the provided port

      api.listen(port); // Log that something happened

      logger.info("API started and listening on port ".concat(port));
    }; // Returns the instance of the server, the strapper and the booter


    return {
      api: api,
      strap: strap,
      boot: boot
    }; // If the application throws an error
    // We catch and log for debugging or splunk
  } catch (e) {
    // Log out the thrown error
    logger.error("API crashed with message ".concat(e.message));
  }
};

var _default = createApi;
exports.default = _default;