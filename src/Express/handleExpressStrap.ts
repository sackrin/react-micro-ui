import path from 'path';
import express from 'express';
import { createElement } from 'react';
import embedComponent from '../Helpers/embedComponent';
import type { MicroUiConfig } from "../Types/MicroUiConfig";
import type { MicroUiConfigProfileEnv } from "../Types/MicroUiConfigProfileEnv";

type HandleExpressStrap = (
  name: string,
  component: string,
  logger: any,
  env: MicroUiConfigProfileEnv,
  config: MicroUiConfig,
  method: string,
) => (req: express.Request, res: express.Response) => Promise<void>;

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const handleExpressStrap: HandleExpressStrap = (name, component, logger, env, config, method) => async (req, res) => {
  // This is needed to stop issues with window and document throwing errors in SSR
  (global as any).window = {};
  (global as any).document = {};
  // Extract and construct the component props from the provided POST and GET variables
  const httpQuery = !req.query ? {} : req.query;
  const httpBody = !req.body ? {} : req.body;
  const props = { ...httpQuery, ...httpBody };
  // Attempt to construct a static HTML representation of the component
  // Do this using provided POST and GET parameters
  try {
    // Attempt to render the component's HTML using react's ReactDOMServer
    const rendered = ReactDOMServer.renderToString(createElement(component, props));
    const html = embedComponent(name, env, config, props, rendered);
    // Set express to return the component as the response body
    res.set('Content-Type', 'text/html');
    res.send(html);
    res.sendStatus(200);
  } catch (e) {
    // Log the error which the renderer encountered
    // @TODO should the error generator be a callback that can be provided to allow better customisation?
    logger.error({ type: 'COMPONENT_RENDER_ERROR', component: name, message: e.message, props });
    // Return a simple error message to the client
    // @TODO should this contain more information?
    // @TODO should this be within the config?
    res.set('Content-Type', 'text/html');
    res.send('Component Error');
    res.sendStatus(500);
  }

};

export default handleExpressStrap;
