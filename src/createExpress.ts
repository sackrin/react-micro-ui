import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import defaultConfig from './microui.default.config';
import { handleExpressNotFound, handleExpressBootstrap, handleExpressStrap } from './Express';
import type { CreateExpress } from "./Types/CreateExpress";
import type { CreateExpressStrap } from "./Types/CreateExpressStrap";
import type { CreateExpressBoot } from "./Types/CreateExpressBoot";

const createExpress: CreateExpress = ({ config, profile = 'local', logger = console }) => {
  // Get the combined config
  const _config = { ...defaultConfig, ...config };
  // Retrieve the environment profiles
  const env = config.environments.profiles[profile] || config.environments.profiles[config.environments.default];
  // Allow for env overrides
  const _cors = env.api?.cors || _config.api.cors;
  const _port = env.api?.port || _config.api.port;
  const _messages = env.api?.messages || _config.api.messages;
  // Retrieve any api env
  const apiEnv = env.api?.env || {};
  // Update the process env with any provided api env
  process.env = { ...process.env, ...apiEnv };
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(_messages.START_UP);
    // Create a new express instance
    const api = express();
    // Setting up middlewares
    api.use(json());
    api.use(helmet());
    api.use(cors(_cors));
    api.use(compression());
    // Serve static assets
    api.use(express.static('./.microui'));
    // Hydrate and output the bootstrapper script
    api.get('/bootstrap.js', handleExpressBootstrap(env, _config));
    // Straps a component into the SSR api
    const strap: CreateExpressStrap = (name, component) => {
      // Handle a GET request to fetch a component
      api.get(`/${name}`, handleExpressStrap(name, component, env, _config, 'GET'));
      // Handle a POST request to fetch a component
      api.post(`/${name}`, handleExpressStrap(name, component, env, _config, 'POST'));
    };
    // Boots up the server
    const boot: CreateExpressBoot = () => {
      // Handle any 404 errors
      api.use(handleExpressNotFound);
      // Start the server listening on the provided port
      api.listen(_port);
      // Log that something happened
      logger.info(_messages.STARTED_UP, _port);
    };
    // Returns the instance of the server, the strapper the booter, the config and the logger
    return { api, strap, boot, env, config: _config, logger };
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_messages.CRASHED, e.message);
  }
};

export default createExpress;