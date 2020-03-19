"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var createLambda = function createLambda(_ref) {
  var config = _ref.config,
      _ref$logger = _ref.logger,
      logger = _ref$logger === void 0 ? console : _ref$logger;
  return function (event, context, callback) {
    // Attempt to start the express server
    try {
      // Saying hello
      logger.info(config.api.messages.START_UP); // If the application throws an error
      // We catch and log for debugging
    } catch (e) {
      // Log out the thrown error
      logger.error(config.api.messages.CRASHED, e.message);
    }
  };
};

var _default = createLambda;
exports.default = _default;