const withLambda = handler => async (event, context) => {
  // @TODO is this how we want to handle different types of request data?
  const payload = await handler({ body: requestBody, params: requestParams, client: { type: 'lambda', event, context } });
  // Deconstruct the express response from the payload
  const { body, headers = {}, status = 200, contentType = 'json' } = payload;
};

export default withLambda;
