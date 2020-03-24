import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import defaultConfig from '../microui.default.config';
import { handleBootstrap, handleNotFound, strapWithExpress, withExpress } from './Handlers';

const createApi = ({ config, profile = 'local', logger = console }) => {
  // Get the combined config
  const _config = { ...defaultConfig, ...config };
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(_config.api.messages.START_UP);
    // Create a new express instance
    const api = express();
    // Setting up middlewares
    api.use(json());
    api.use(helmet());
    api.use(cors(_config.api.cors));
    api.use(compression());
    api.enable(_config.api.trustProxy);
    // Serve static assets
    api.use(express.static('./.microui'));
    // Hydrate and output the bootstrapper script
    api.get('/bootstrap.js', withExpress(handleBootstrap(profile, _config)));
    // Straps a component into the SSR api
    const strap = (name, component) => {
      // Handle a GET request to fetch a component
      api.get(`/${name}`, strapWithExpress(name, component, _config, 'GET'));
      // Handle a POST request to fetch a component
      api.post(`/${name}`, strapWithExpress(name, component, _config, 'POST'));
    };
    // Boots up the server
    const boot = () => {
      // Handle any 404 errors
      api.use(withExpress(handleNotFound));
      // Start the server listening on the provided port
      api.listen(_config.api.port);
      // Log that something happened
      logger.info(_config.api.messages.STARTED_UP, _config.api.port);
    };
    // Returns the environment vars
    const env = () => {
      // Retrieve the environment property
      const { environments } = config;
      // Retrieve the environment profiles
      return environments.profiles[profile] || environments.profiles[environments.default];
    };
    // Returns the instance of the server, the strapper the booter, the config and the logger
    return { api, strap, boot, env, config: _config, logger };
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_config.api.messages.CRASHED, e.message);
  }
};

export default createApi;
