import 'core-js/stable';
import 'regenerator-runtime/runtime';
import defaultConfig from './microui.default.config';
import { handleLambdaNotFound, handleLambdaBootstrap, handleLambdaStrap } from './Lambda';
import type { CreateLambda } from "./Types/CreateLambda";
import type { LambdaRoute } from "./Types/LambdaRoute";
import type { CreateLambdaStrap } from "./Types/CreateLambdaStrap";
import type { CreateLambdaBoot } from "./Types/CreateLambdaBoot";
import type { CreateLambdaRoute } from "./Types/CreateLambdaRoute"

const createLambda: CreateLambda = (event, context, { config, profile = 'local', logger = console }) => {
  // Get the combined config
  const _config = { ...defaultConfig, ...config };
  // Retrieve the environment profiles
  const env = config.environments.profiles[profile] || config.environments.profiles[config.environments.default];
  // Allow for env overrides
  const _messages = env.api?.messages || _config.api.messages;
  // Retrieve any api env
  const apiEnv = env.api?.env || {};
  // Update the process env with any provided api env
  process.env = { ...process.env, ...apiEnv };
  // Where we will store the lambda routes
  const routes: LambdaRoute[] = [];
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(_messages.START_UP);
    // Hydrate and output the bootstrapper script
    routes.push(['/bootstrap.js', 'GET', handleLambdaBootstrap(env, _config)]);
    // Adds a route to a router of sorts
    const route: CreateLambdaRoute = (path, method, handler) => {
      // Push into the route queue
      routes.push([path, method, handler]);
    };
    // Straps a component into the SSR api
    const strap: CreateLambdaStrap = (name, component) => {
      // Handle a GET request to fetch a component
      routes.push([`/${name}`, 'GET', handleLambdaStrap(name, component, env, _config, 'GET')]);
      // Handle a POST request to fetch a component
      routes.push([`/${name}`, 'POST', handleLambdaStrap(name, component, env, _config, 'POST')]);
    };
    // Boots and executes the lambda server
    const boot: CreateLambdaBoot = async (event, context) => {
      // Retrieve the path and method
      const {
        requestContext: {
          http: { path, method },
        },
      } = event;
      // Search for and return the relevant handler
      // @TODO would be cool to use a regex in the future?
      // @TODO yes a find would probably be better
      const route = routes.find(
        ([_path, _method, _handler]) => (_path === path && method === _method)
      );
      // Retrieve the payload
      return route ? route[2](event, context) : handleLambdaNotFound(event, context);
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
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};

export default createLambda;
