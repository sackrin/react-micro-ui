"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _express = _interopRequireWildcard(require("express"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _compression = _interopRequireDefault(require("compression"));

var _microuiDefault = _interopRequireDefault(require("./microui.default.config"));

var _Handlers = require("./Handlers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const createApi = ({
  config,
  profile = 'local',
  logger = console
}) => {
  // Get the combined config
  const _config = { ..._microuiDefault.default,
    ...config
  }; // Attempt to start the express server

  try {
    // Saying hello
    logger.info(_config.api.messages.START_UP); // Create a new express instance

    const api = (0, _express.default)(); // Setting up middlewares

    api.use((0, _express.json)());
    api.use((0, _helmet.default)());
    api.use((0, _cors.default)(_config.api.cors));
    api.use((0, _compression.default)());
    api.enable(_config.api.trustProxy); // Serve static assets

    api.use(_express.default.static('./.microui')); // Hydrate and output the bootstrapper script

    api.get('/bootstrap.js', (0, _Handlers.withExpress)((0, _Handlers.handleBootstrap)(profile, _config))); // Straps a component into the SSR api

    const strap = (name, component) => {
      // Handle a GET request to fetch a component
      api.get(`/${name}`, (0, _Handlers.strapWithExpress)(name, component, _config, 'GET')); // Handle a POST request to fetch a component

      api.post(`/${name}`, (0, _Handlers.strapWithExpress)(name, component, _config, 'POST'));
    }; // Boots up the server


    const boot = () => {
      // Handle any 404 errors
      api.use((0, _Handlers.withExpress)(_Handlers.handleNotFound)); // Start the server listening on the provided port

      api.listen(_config.api.port); // Log that something happened

      logger.info(_config.api.messages.STARTED_UP, _config.api.port);
    }; // Returns the environment vars


    const env = () => {
      // Retrieve the environment property
      const {
        environments
      } = config; // Retrieve the environment profiles

      return environments.profiles[profile] || environments.profiles[environments.default];
    }; // Returns the instance of the server, the strapper the booter, the config and the logger


    return {
      api,
      strap,
      boot,
      env,
      config: _config,
      logger
    }; // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_config.api.messages.CRASHED, e.message);
  }
};

var _default = createApi;
exports.default = _default;