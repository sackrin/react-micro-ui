import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createElement } from 'react';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import { handleBootstrap, handleNotFound } from "./Handlers";

// Import react
const ReactDOMServer = require(
  path.join(
    process.cwd(),
    'node_modules',
    'react-dom',
    'server'
  )
);

const microUIConfig = require(path.join(process.cwd(), 'microui.config.js'));

const JsWrapper = (name, config, props, el) => ('<div data-microui-library="' + config.name + '" data-microui-component="' + name + '">' +
  '' + el + '' +
  '<script type="application/javascript">' +
  ' if (!!document.getElementById(`' + config.name + 'Library`)) { ' +
  '   var tag = document.createElement(\'script\'); ' +
  '   tag.id = `' + config.name + 'Library`; ' +
  '   tag.src = `' + config.url + 'bootstrap.js`; ' +
  '   document.body.appendChild(tag); ' +
  ' } ' +
  ' (function(n, c, p, t) { ' +
  '   var w = window, m = function(e){ if (e.detail.library === n)' +
  '     w[n].default.hydrateComponent(document.querySelector(\`div[data-microui-component="' + name + '"] div[data-reactroot]\`),c,p,t); };' +
  '     if (w[n]) { m(); } else { w.addEventListener(\'microUILoaded\', m); }' +
  '   })(\'' + config.name + '\', \'' + name + '\', ' + JSON.stringify(props) + ', {});' +
  '</script>' +
  '</div>');

const createApi = ({ port = 9000 }) => {
	// Attempt to start the express server
	try {
		// Saying hello
		console.log('API starting');
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
    api.get('/bootstrap.js', handleBootstrap(microUIConfig));
		// Straps a component into the SSR api
		const strap = (name, component) => {
			// Handle a GET request to fetch a component
      api.get(`/${name}`, (req, res) => {
				res.send(JsWrapper(name, microUIConfig, req.query, ReactDOMServer.renderToString(createElement(component, req.query))));
			});
			// Handle a POST request to fetch a component
      api.post(`/${name}`, (req, res) => {
				res.send(JsWrapper(name, microUIConfig, req.body, ReactDOMServer.renderToString(createElement(component, req.body))));
			});
		};
		// Boots up the server
		const boot = () => {
			// Handle any 404 errors
      api.use(handleNotFound);
			// Start the server listening on the provided port
      api.listen(port);
			// Log that something happened
			console.log(`API started and listening on port ${port}`);
		};
		// Returns the instance of the server, the strapper and the booter
		return { api, strap, boot };
	// If the application throws an error
	// We catch and log for debugging or splunk
	} catch (e) {
		// Log out the thrown error
		console.error(`API crashed with message ${e.message}`);
	}
};

export default createApi;
