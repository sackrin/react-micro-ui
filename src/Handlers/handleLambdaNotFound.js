const handleLambdaNotFound = (event, context) => ({
  statusCode: '404',
  body: JSON.stringify({ notFound: true }),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default handleLambdaNotFound;
