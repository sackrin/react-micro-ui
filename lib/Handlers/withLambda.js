"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const withLambda = handler => async (event, context) => {
  // Extract params and body
  const requestParams = event.queryStringParameters && event.queryStringParameters !== null ? event.queryStringParameters : {};
  const requestBody = event.body && event.body !== null ? JSON.parse(event.body) : {}; // @TODO is this how we want to handle different types of request data?

  const payload = await handler({
    body: requestBody,
    params: requestParams,
    client: {
      type: 'lambda',
      event,
      context
    }
  }); // Deconstruct the express response from the payload

  const {
    status = 200
  } = payload;
  return { ...payload,
    statusCode: status
  };
};

var _default = withLambda;
exports.default = _default;