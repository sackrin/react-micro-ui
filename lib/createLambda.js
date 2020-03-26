"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _microuiDefault = _interopRequireDefault(require("./microui.default.config"));

var _Handlers = require("./Handlers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createLambda = (event, context, {
  config,
  profile = 'local',
  logger = console
}) => {
  // Get the combined config
  const _config = { ..._microuiDefault.default,
    ...config
  }; // Where we will store the lambda routes

  const routes = []; // Attempt to start the express server

  try {
    // Saying hello
    logger.info(_config.api.messages.START_UP); // Hydrate and output the bootstrapper script

    routes.push(['/bootstrap.js', 'GET', (0, _Handlers.withLambda)((0, _Handlers.handleBootstrap)(profile, _config))]); // Adds a route to a router of sorts

    const route = (path, method, handler) => {
      // Push into the route queue
      routes.push([path, method, handler]);
    }; // Straps a component into the SSR api


    const strap = (name, component) => {
      // Handle a GET request to fetch a component
      routes.push([`/${name}`, 'GET', (0, _Handlers.strapWithLambda)(name, component, _config, 'GET')]); // Handle a POST request to fetch a component

      routes.push([`/${name}`, 'POST', (0, _Handlers.strapWithLambda)(name, component, _config, 'POST')]);
    }; // Boots and executes the lambda server


    const boot = async (event, context) => {
      // Retrieve the path and method
      const {
        path,
        httpMethod
      } = event; // Search for and return the relevant handler
      // @TODO would be cool to use a regex in the future?

      const handler = routes.reduce((curr, [_path, _method, _handler]) => {
        return _path === path && httpMethod === _method ? _handler : curr;
      }, undefined); // Retrieve the payload

      return handler ? handler(event, context) : {
        statusCode: '404',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }; // Returns the environment vars


    const env = () => {
      // Retrieve the environment property
      const {
        environments
      } = config; // Retrieve the environment profiles

      return environments.profiles[profile] || environments.profiles[environments.default];
    }; // Returns the instance of the server, the strapper the booter, the config and the logger


    return {
      route,
      strap,
      boot,
      env,
      config: _config,
      logger
    }; // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_config.api.messages.CRASHED, e.message); // Trigger the callback

    return {
      statusCode: '500',
      body: JSON.stringify({
        itBroke: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};

var _default = createLambda;
exports.default = _default;