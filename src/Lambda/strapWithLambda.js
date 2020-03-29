import path from 'path';
import { createElement } from 'react';
import embedComponent from '../Helpers/embedComponent';

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const strapWithLambda = (name, component, env, config, method) => (event, context) => {
  const { queryStringParameters, body } = event;
  const httpQuery = !queryStringParameters ? {} : queryStringParameters;
  const httpBody = !body ? {} : JSON.parse(body);
  const props = { ...httpQuery, ...httpBody };
  return {
    headers: {
      'content-type': 'text/html',
      expires: '-1',
      'cache-control': 'private, no-cache, no-store, must-revalidate',
      pragma: 'no-cache',
    },
    statusCode: 200,
    body: embedComponent(name, env, config, props, ReactDOMServer.renderToString(createElement(component, props))),
  };
};

export default strapWithLambda;
