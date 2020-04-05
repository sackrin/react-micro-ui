import { expect } from 'chai';
import handleLambdaNotFound from '../handleLambdaNotFound';

describe('Lambda/handleLambdaNotFound', () => {
  const mockEvent = {};
  const mockContext = {};

  it('can correctly output a not found response for lambda', async () => {
    const payload = await handleLambdaNotFound(mockEvent, mockContext);
    expect(payload).to.deep.equal({
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ notFound: true }),
      statusCode: 404,
    });
  });
});
