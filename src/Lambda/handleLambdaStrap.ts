import path from 'path';
import { createElement } from 'react';
import embedComponent from '../Helpers/embedComponent';
import { MicroUiConfigProfileEnv } from '../Types/MicroUiConfigProfileEnv';
import { MicroUiConfig } from '../Types/MicroUiConfig';
import { LambdaResponse } from '../Types/LambdaResponse';

type HandleLambdaStrap = (
  name: string,
  component: string,
  logger: any,
  env: MicroUiConfigProfileEnv,
  config: MicroUiConfig,
  method: string,
) => (event: any, context: any) => Promise<LambdaResponse>;

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const handleLambdaStrap: HandleLambdaStrap = (name, component, logger, env, config, method) => async (
  event,
  context,
) => {
  // Extract and construct the component props from the provided POST and GET variables
  const { queryStringParameters, body } = event;
  const httpQuery = !queryStringParameters ? {} : queryStringParameters;
  const httpBody = !body ? {} : JSON.parse(body);
  const props = { ...httpQuery, ...httpBody };
  // Attempt to construct a static HTML representation of the component
  // Do this using provided POST and GET parameters
  try {
    // Attempt to render the component's HTML using react's ReactDOMServer
    const rendered = ReactDOMServer.renderToString(createElement(component, props));
    const html = embedComponent(name, env, config, props, rendered);
    // Return the static HTML to the client
    return {
      headers: {
        'content-type': 'text/html',
        expires: '-1',
        'cache-control': 'private, no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
      },
      body: html,
      statusCode: 200,
    };
  } catch (e) {
    // Log the error which the renderer encountered
    // @TODO should the error generator be a callback that can be provided to allow better customisation?
    logger.error({ type: 'COMPONENT_RENDER_ERROR', component: name, message: e.message, props });
    // Return a simple error message to the client
    // @TODO should this contain more information?
    // @TODO should this be within the config?
    return {
      headers: {
        'content-type': 'text/html',
        expires: '-1',
        'cache-control': 'private, no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
      },
      body: 'Component Error',
      statusCode: 500,
    };
  }
};

export default handleLambdaStrap;
