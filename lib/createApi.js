"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

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
      logger = _ref$logger === void 0 ? console : _ref$logger;

  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(config.api.messages.START_UP); // Create a new express instance

    var api = (0, _express.default)(); // Setting up middlewares

    api.use((0, _express.json)());
    api.use((0, _helmet.default)());
    api.use((0, _cors.default)(config.api.cors));
    api.use((0, _compression.default)());
    api.enable(config.api.trustProxy); // Serve static assets

    api.use(_express.default.static('./.microui')); // Hydrate and output the bootstrapper script

    api.get('/bootstrap.js', (0, _Handlers.withExpress)((0, _Handlers.handleBootstrap)(config))); // Straps a component into the SSR api

    var strap = function strap(name, component) {
      // Handle a GET request to fetch a component
      api.get("/".concat(name), (0, _Handlers.strapWithExpress)(name, component, config, 'GET')); // Handle a POST request to fetch a component

      api.post("/".concat(name), (0, _Handlers.strapWithExpress)(name, component, config, 'POST'));
    }; // Boots up the server


    var boot = function boot() {
      // Handle any 404 errors
      api.use((0, _Handlers.withExpress)(_Handlers.handleNotFound)); // Start the server listening on the provided port

      api.listen(config.api.port); // Log that something happened

      logger.info(config.api.messages.STARTED_UP, config.api.port);
    }; // Returns the instance of the server, the strapper the booter, the config and the logger


    return {
      api: api,
      strap: strap,
      boot: boot,
      config: config,
      logger: logger
    }; // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(config.api.messages.CRASHED, e.message);
  }
};

var _default = createApi;
exports.default = _default;