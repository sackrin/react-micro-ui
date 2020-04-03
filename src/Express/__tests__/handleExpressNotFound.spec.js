import { expect } from 'chai';
import handleExpressNotFound from '../handleExpressNotFound';

describe('Express/handleExpressNotFound', () => {
  it('can correctly output a not found response for express', async () => {
    const payload = await handleExpressNotFound();
    expect(payload).to.deep.equal({
      status: 404,
    });
  });
});
