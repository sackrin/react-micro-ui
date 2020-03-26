import path from 'path';
import getJSWrapper from './getJSWrapper';
import { createElement } from 'react';

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const strapWithLambda = (name, component, config, method) => (event, context) => {
  const { queryStringParameters, body } = event;
  const httpQuery = queryStringParameters || queryStringParameters === null ? {} : queryStringParameters;
  const httpBody = body || body === null ? {} : JSON.stringify(body);
  const props = { ...httpQuery, ...httpBody };
  return {
    headers: {
      'content-type': 'text/html',
      expires: '-1',
      'cache-control': 'private, no-cache, no-store, must-revalidate',
      pragma: 'no-cache',
    },
    statusCode: 200,
    body: getJSWrapper(name, config, props, ReactDOMServer.renderToString(createElement(component, props))),
  };
};

export default strapWithLambda;
