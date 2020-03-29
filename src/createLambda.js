import 'core-js/stable';
import 'regenerator-runtime/runtime';
import defaultConfig from './microui.default.config';
import { handleBootstrap } from './Handlers';
import { handleLambdaNotFound, strapWithLambda, withLambda } from './Lambda';

const createLambda = (event, context, { config, profile = 'local', logger = console }) => {
  // Get the combined config
  const _config = { ...defaultConfig, ...config };
  // Retrieve the environment profiles
  const env = config.environments.profiles[profile] || config.environments.profiles[config.environments.default];
  // Allow for env overrides
  const _messages = env.api?.messages ? env.api?.messages : _config.api.messages;
  // Retrieve any api env
  const apiEnv = env.api?.env ? env.api?.env : {};
  // Update the process env with any provided api env
  process.env = { ...process.env, ...apiEnv };
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
      const {
        requestContext: {
          http: { path, method },
        },
      } = event;
      // Search for and return the relevant handler
      // @TODO would be cool to use a regex in the future?
      // @TODO yes a find would probably be better
      const handler = routes.reduce(
        (curr, [_path, _method, _handler]) => (_path === path && method === _method ? _handler : curr),
        undefined,
      );
      // Retrieve the payload
      return handler ? handler(event, context) : handleLambdaNotFound(event, context);
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
