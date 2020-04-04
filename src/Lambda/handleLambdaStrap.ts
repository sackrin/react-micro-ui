import path from 'path';
import { createElement } from 'react';
import embedComponent from '../Helpers/embedComponent';
import { MicroUiConfigProfileEnv } from '../Types/MicroUiConfigProfileEnv';
import { MicroUiConfig } from '../Types/MicroUiConfig';
import { LambdaResponse } from '../Types/LambdaResponse';

type HandleLambdaStrap = (
  name: string,
  component: string,
  env: MicroUiConfigProfileEnv,
  config: MicroUiConfig,
  method: string,
) => (event: any, context: any) => Promise<LambdaResponse>;

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const handleLambdaStrap: HandleLambdaStrap = (name, component, env, config, method) => async (event, context) => {
  const { queryStringParameters, body } = event;
  const httpQuery = !queryStringParameters ? {} : queryStringParameters;
  const httpBody = !body ? {} : JSON.parse(body);
  const props = { ...httpQuery, ...httpBody };
  const rendered = ReactDOMServer.renderToString(createElement(component, props));
  const html = embedComponent(name, env, config, props, rendered);
  return {
    headers: {
      'content-type': 'text/html',
      'expires': '-1',
      'cache-control': 'private, no-cache, no-store, must-revalidate',
      'pragma': 'no-cache',
    },
    body: html,
    statusCode: 200,
  };
};

export default handleLambdaStrap;
