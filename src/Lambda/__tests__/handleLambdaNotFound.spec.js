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

  it('can pass the corsHeaders object through to the response', async () => {
    const corsHeaders = {
      testHeader: 'value',
      testHeader2: 'value2',
    };
    const payload = await handleLambdaNotFound(mockEvent, mockContext, corsHeaders);
    expect(payload.headers.testHeader).to.equal('value');
    expect(payload.headers.testHeader2).to.equal('value2');
  });
});
