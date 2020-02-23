import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createElement } from 'react';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import { getJSWrapper, handleBootstrap, handleNotFound } from './Handlers';

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const createApi = ({ config, logger = console }) => {
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(config.api.messages.START_UP);
    // Create a new express instance
    const api = express();
    // Setting up middlewares
    api.use(json());
    api.use(helmet());
    api.use(cors(config.api.cors));
    api.use(compression());
    api.enable(config.api.trustProxy);
    // Serve static assets
    api.use(express.static('./.microui'));
    // Hydrate and output the bootstrapper script
    api.get('/bootstrap.js', handleBootstrap(config));
    // Straps a component into the SSR api
    const strap = (name, component) => {
      // Handle a GET request to fetch a component
      api.get(`/${name}`, (req, res) => {
        res.send(
          getJSWrapper(name, config, req.query, ReactDOMServer.renderToString(createElement(component, req.query))),
        );
      });
      // Handle a POST request to fetch a component
      api.post(`/${name}`, (req, res) => {
        res.send(
          getJSWrapper(name, config, req.body, ReactDOMServer.renderToString(createElement(component, req.body))),
        );
      });
    };
    // Boots up the server
    const boot = () => {
      // Handle any 404 errors
      api.use(handleNotFound);
      // Start the server listening on the provided port
      api.listen(config.api.port);
      // Log that something happened
      logger.info(config.api.messages.STARTED_UP, port);
    };
    // Returns the instance of the server, the strapper the booter, the config and the logger
    return { api, strap, boot, config, logger };
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(config.api.messages.CRASHED, e.message);
  }
};

export default createApi;
