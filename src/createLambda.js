import 'core-js/stable';
import 'regenerator-runtime/runtime';

const createLambda = ({ config, logger = console }) => (event, context, callback) => {
  // Attempt to start the express server
  try {
    // Saying hello
    logger.info(config.api.messages.START_UP);
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(config.api.messages.CRASHED, e.message);
  }
};

export default createLambda;
