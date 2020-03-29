import path from 'path';
import { createElement } from 'react';
import embedComponent from '../Helpers/embedComponent';

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const strapWithExpress = (name, component, env, config, method) => (req, res) => {
  res.send(
    embedComponent(
      name,
      env,
      config,
      method === 'GET' ? req.query : req.body,
      ReactDOMServer.renderToString(createElement(component, method === 'GET' ? req.query : req.body)),
    ),
  );
};

export default strapWithExpress;
