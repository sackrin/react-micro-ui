import 'core-js/stable';
import 'regenerator-runtime/runtime';
import defaultConfig from './microui.default.config';
import { handleBootstrap, strapWithLambda, withLambda } from './Handlers';

const createLambda = (event, context, { config, profile = 'local', logger = console }) => {
  // Get the combined config
  const _config = { ...defaultConfig, ...config };
  // Retrieve the environment profiles
  const env = environments.profiles[profile] || environments.profiles[environments.default];
  // Allow for env overrides
  const _cors = env.api?.cors ? env.api?.cors : _config.api.cors;
  const _trustProxy = env.api?.trustProxy ? env.api?.trustProxy : _config.api.trustProxy;
  const _port = env.api?.port ? env.api?.port : _config.api.port;
  const _messages = env.api?.messages ? env.api?.messages : _config.api.messages;
  // Where we will store the lambda routes
  const routes = [];
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(_messages.START_UP);
    // Hydrate and output the bootstrapper script
    routes.push(['/bootstrap.js', 'GET', withLambda(handleBootstrap(profile, env, _config))]);
    // Adds a route to a router of sorts
    const route = (path, method, handler) => {
      // Push into the route queue
      routes.push([path, method, handler]);
    };
    // Straps a component into the SSR api
    const strap = (name, component) => {
      // Handle a GET request to fetch a component
      routes.push([`/${name}`, 'GET', strapWithLambda(name, component, env, _config, 'GET')]);
      // Handle a POST request to fetch a component
      routes.push([`/${name}`, 'POST', strapWithLambda(name, component, env, _config, 'POST')]);
    };
    // Boots and executes the lambda server
    const boot = async (event, context) => {
      // Retrieve the path and method
      const { path, httpMethod } = event;
      // Search for and return the relevant handler
      // @TODO would be cool to use a regex in the future?
      const handler = routes.reduce((curr, [_path, _method, _handler]) => {
        return _path === path && httpMethod === _method ? _handler : curr;
      }, undefined);
      // Retrieve the payload
      return handler
        ? handler(event, context)
        : {
            statusCode: '404',
            body: JSON.stringify({}),
            headers: {
              'Content-Type': 'application/json',
            },
          };
    };
    // Returns the instance of the server, the strapper the booter, the config and the logger
    return { route, strap, boot, env, config: _config, logger };
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_messages.CRASHED, e.message);
    // Trigger the callback
    return {
      statusCode: '500',
      body: JSON.stringify({ itBroke: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

export default createLambda;
