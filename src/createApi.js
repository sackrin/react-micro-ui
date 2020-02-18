import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createElement } from 'react';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import { getJSWrapper, handleBootstrap, handleNotFound } from "./Handlers";

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(
  path.join(
    process.cwd(),
    'node_modules',
    'react-dom',
    'server'
  )
);

const createApi = ({ config, logger = console, port = 9000 }) => {
	// Attempt to start the express server
	try {
		// Saying hello
    logger.info('API starting');
		// Create a new express instance
		const api = express();
		// Setting up middlewares
    api.use(json());
    api.use(helmet());
    api.use(cors({ origin: '*' }));
    api.use(compression());
    api.enable('trust proxy');
		// Serve static assets
    api.use(express.static('./.microui'));
		// Hydrate and output the bootstrapper script
    api.get('/bootstrap.js', handleBootstrap(config));
		// Straps a component into the SSR api
		const strap = (name, component) => {
			// Handle a GET request to fetch a component
      api.get(`/${name}`, (req, res) => {
				res.send(getJSWrapper(name, config, req.query, ReactDOMServer.renderToString(createElement(component, req.query))));
			});
			// Handle a POST request to fetch a component
      api.post(`/${name}`, (req, res) => {
				res.send(getJSWrapper(name, config, req.body, ReactDOMServer.renderToString(createElement(component, req.body))));
			});
		};
		// Boots up the server
		const boot = () => {
			// Handle any 404 errors
      api.use(handleNotFound);
			// Start the server listening on the provided port
      api.listen(port);
			// Log that something happened
      logger.info(`API started and listening on port ${port}`);
		};
		// Returns the instance of the server, the strapper and the booter
		return { api, strap, boot };
	// If the application throws an error
	// We catch and log for debugging or splunk
	} catch (e) {
		// Log out the thrown error
    logger.error(`API crashed with message ${e.message}`);
	}
};

export default createApi;
