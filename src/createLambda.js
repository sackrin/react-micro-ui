import 'core-js/stable';
import 'regenerator-runtime/runtime';
import defaultConfig from '../microui.default.config';
import { handleBootstrap, strapWithLambda, withLambda } from './Handlers';

const createLambda = ({ config, profile = 'local', logger = console }) => (event, context, callback) => {
  // Get the combined config
  const _config = { ...defaultConfig, ...config };
  // Where we will store the lambda routes
  const routes = [];
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(_config.api.messages.START_UP);
    // Hydrate and output the bootstrapper script
    api.get(['/bootstrap.js', 'GET', withLambda(handleBootstrap(profile, _config))]);
    // Adds a route to a router of sorts
    const route = (path, method, handler) => {
      // Push into the route queue
      routes.push([path, method, handler]);
    };
    // Straps a component into the SSR api
    const strap = (name, component) => {
      // Handle a GET request to fetch a component
      routes.push([`/name`, 'GET', strapWithLambda(name, component, _config, 'GET')]);
      // Handle a POST request to fetch a component
      routes.push([`/name`, 'POST', strapWithLambda(name, component, _config, 'POST')]);
    };
    // Boots and executes the lambda server
    const boot = (event, context, callback) => {
      // Retrieve the path and method
      const { path, httpMethod } = event;
      // Search for and return the relevant handler
      // @TODO would be cool to use a regex in the future?
      const handler = routes.reduce((curr, [_path, _method, _handler]) => {
        return _path === path && httpMethod && _method ? _handler : curr;
      }, undefined);
      // Trigger the callback
      callback(null, handler(event, context));
    };
    // Returns the environment vars
    const env = () => {
      // Retrieve the environment property
      const { environments } = config;
      // Retrieve the environment profiles
      return environments.profiles[profile] || environments.profiles[environments.default];
    };
    // Returns the instance of the server, the strapper the booter, the config and the logger
    return { route, strap, boot, env, config: _config, logger };
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_config.api.messages.CRASHED, e.message);
  }
};

export default createLambda;
