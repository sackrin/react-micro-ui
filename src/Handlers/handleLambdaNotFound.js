const handleLambdaNotFound = () => ({
  statusCode: '404',
  body: JSON.stringify({}),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default handleLambdaNotFound;
