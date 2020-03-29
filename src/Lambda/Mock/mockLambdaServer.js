import express, { json } from 'express';
import useAsLambda from './useAsLambda';

const mockLambdaServer = handler => {
  // Create a new express instance
  const server = express();
  // Setting up middlewares
  server.use(json());
  // Serve static assets
  server.use(express.static('./.microui'));
  // Add the use lambda polyfill
  server.use(useAsLambda(handler));
  // Boot helper
  const boot = (port = 9000) => {
    server.listen(port);
  };
  // Return the mock server
  return { boot, server };
};

export default mockLambdaServer;
