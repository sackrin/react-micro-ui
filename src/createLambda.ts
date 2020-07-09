import 'core-js/stable';
import 'regenerator-runtime/runtime';
import defaultConfig from './microui.default.config';
import { handleLambdaNotFound, handleLambdaBootstrap, handleLambdaStrap } from './Lambda';
import type { CreateLambda } from './Types/CreateLambda';
import type { LambdaRoute } from './Types/LambdaRoute';
import type { CreateLambdaStrap } from './Types/CreateLambdaStrap';
import type { CreateLambdaBoot } from './Types/CreateLambdaBoot';
import type { CreateLambdaRoute } from './Types/CreateLambdaRoute';
import { LambdaResponse } from './Types/LambdaResponse';

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
  const _cors = env.api?.cors || config.api.cors;
  const corsHeaders: { [key: string]: string } = {};
  if (_cors) {
    if (_cors.origin) {
      corsHeaders['Access-Control-Allow-Origin'] = _cors.origin;
    }
    if (_cors.methods) {
      corsHeaders['Access-Control-Allow-Methods'] = _cors.methods;
    }
    if (_cors.headers) {
      corsHeaders['Access-Control-Allow-Headers'] = _cors.headers;
    }
    if (_cors.maxAge) {
      corsHeaders['Access-Control-Max-Age'] = _cors.maxAge;
    }
  }
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(_messages.START_UP);
    // Hydrate and output the bootstrapper script
    routes.push(['/bootstrap.js', 'GET', handleLambdaBootstrap(env, _config, corsHeaders)]);
    // Adds a route to a router of sorts
    const route: CreateLambdaRoute = (path, method, handler) => {
      // Push into the route queue
      routes.push([path, method, handler]);
    };
    // Straps a component into the SSR api
    const strap: CreateLambdaStrap = (name, component) => {
      // Handle a GET request to fetch a component
      routes.push([`/${name}`, 'GET', handleLambdaStrap(name, component, logger, env, _config, 'GET', corsHeaders)]);
      // Handle a POST request to fetch a component
      routes.push([`/${name}`, 'POST', handleLambdaStrap(name, component, logger, env, _config, 'POST', corsHeaders)]);
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
      const route = routes.find(([_path, _method, _handler]) => _path === path && method === _method);
      // Retrieve the payload
      if (route) {
        return new Promise<LambdaResponse>((resolve, reject) => {
          // Wait for the route to gather a response then inject CORS headers.
          route[2](event, context)
            .then((response) => {
              response.headers = {
                ...corsHeaders,
                ...response.headers,
              };
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      } else {
        return handleLambdaNotFound(event, context, corsHeaders);
      }
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
        ...corsHeaders,
        'content-type': 'application/json',
      },
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};

export default createLambda;
