import type { LambdaResponse } from '../Types/LambdaResponse';

type HandleLambdaNotFound = (event: any, context: any) => Promise<LambdaResponse>;

const handleLambdaNotFound: HandleLambdaNotFound = async (event, context) => ({
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({ notFound: true }),
  statusCode: 404,
});

export default handleLambdaNotFound;
