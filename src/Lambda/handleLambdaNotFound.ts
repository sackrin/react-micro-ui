import type { LambdaResponse } from '../Types/LambdaResponse';

type HandleLambdaNotFound = (
  event: any,
  context: any,
  corsHeaders: { [key: string]: string }
) => Promise<LambdaResponse>;
// @todo CORS here as well
const handleLambdaNotFound: HandleLambdaNotFound = async (event, context, corsHeaders = {}) => ({
  headers: {
    ...corsHeaders,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ notFound: true }),
  statusCode: 404,
});

export default handleLambdaNotFound;
