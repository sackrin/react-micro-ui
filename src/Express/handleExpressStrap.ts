import path from 'path';
import express from 'express';
import { createElement } from 'react';
import embedComponent from '../Helpers/embedComponent';
import type { MicroUiConfig } from "../Types/MicroUiConfig";
import type { MicroUiConfigProfileEnv } from "../Types/MicroUiConfigProfileEnv";

type HandleExpressStrap = (
  name: string,
  component: string,
  env: MicroUiConfigProfileEnv,
  config: MicroUiConfig,
  method: string,
) => (req: express.Request, res: express.Response) => Promise<void>;

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const handleExpressStrap: HandleExpressStrap = (name, component, env, config, method) => async (req, res) => {
  const props = method === 'GET' ? req.query : req.body;
  const rendered = ReactDOMServer.renderToString(createElement(component, props));
  const html = embedComponent(name, env, config, props, rendered);
  res.set('Content-Type', 'text/html');
  res.send(html);
  res.sendStatus(200);
};

export default handleExpressStrap;
