import path from 'path';
import getJSWrapper from './getJSWrapper';
import { createElement } from 'react';

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const strapWithExpress = (name, component, config, method) => (req, res) => {
  res.send(
    getJSWrapper(
      name,
      config,
      method === 'GET' ? req.query : req.body,
      ReactDOMServer.renderToString(createElement(component, method === 'GET' ? req.query : req.body)),
    ),
  );
};

export default strapWithExpress;
