const handleLambdaNotFound = (event, context) => ({
  statusCode: '404',
  body: JSON.stringify({ notFound: true, event, context }),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default handleLambdaNotFound;
