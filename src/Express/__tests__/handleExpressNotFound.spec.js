import { expect } from 'chai';
import sinon from 'sinon';
import handleExpressNotFound from '../handleExpressNotFound';

describe('Express/handleExpressNotFound', () => {

  const mockReq = {};
  const mockRes = {
    sendStatus: sinon.fake()
  };

  it('can correctly output a not found response for express', async () => {
    await handleExpressNotFound(mockReq, mockRes);
    expect(mockRes.sendStatus).to.have.been.calledWith(404);
  });
});
