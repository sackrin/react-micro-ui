const withExpress = handler => async (req, res) => {
  // Retrieve the payload
  // @TODO we should probably fill all express options?
  // @TODO should we wrap this in a try catch?
  // @TODO what happens if this fails?
  const requestBody = req.body || {};
  const requestParams = req.params || {};
  // Pass in the body and the params
  // @TODO is this how we want to handle different types of request data?
  const payload = await handler({ body: requestBody, params: requestParams, client: { type: 'express', req, res } });
  // Deconstruct the express response from the payload
  const { body, headers = {}, status = 200, contentType = 'json' } = payload;
  // Add any headers to the response
  Object.entries(headers).reduce((curr, [headerName, headerValue]) => {
    // Set the header
    curr.setHeader(headerName, headerValue);
    // Return the res for the next header set
    return curr;
  }, res);
  // Set the response status
  res.status(status);
  // Set the response body
  if (contentType === 'json') {
    res.json(body);
  } else {
    res.send(body);
  }
};

export default withExpress;
