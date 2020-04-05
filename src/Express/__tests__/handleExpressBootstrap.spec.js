import fs from 'fs';
import { expect } from 'chai';
import sinon from 'sinon';
import handleExpressBootstrap from '../handleExpressBootstrap';
import config from '../../microui.default.config';

describe('Express/handleExpressBootstrap', () => {

  const mockReq = {};

  const mockRes = {
    set: sinon.fake(),
    send: sinon.fake(),
    sendStatus: sinon.fake(),
  };

  it('can correctly output a bootstrap response', async () => {
    const fileSync = sinon.stub();
    fileSync.onFirstCall().returns(JSON.stringify({ main: 'main.js' }));
    fileSync.onSecondCall().returns('Example text const manifest = __MANIFEST__ and const env = __ENV__ instead of bootstrap.js');
    fs.readFileSync = fileSync;
    await handleExpressBootstrap({ testEnvVar: true }, config)(mockReq, mockRes);
    expect(mockRes.set.getCall(0)).to.have.been.calledWith('Content-Type', 'application/javascript');
    expect(mockRes.set.getCall(1)).to.have.been.calledWith('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    expect(mockRes.set.getCall(2)).to.have.been.calledWith('Expires', '-1');
    expect(mockRes.set.getCall(3)).to.have.been.calledWith('Pragma', 'no-cache');
    expect(mockRes.send).to.have.been.calledWith('Example text const manifest = {"main":"main.js"} and const env = {"name":"exampleMicroUI","apiUrl":"http://localhost:9000","apiPath":"/api/v1","assetUrl":"http://localhost:9000","assetTarget":"umd","assetEntry":"main.js"} instead of bootstrap.js');
    expect(mockRes.sendStatus).to.have.been.calledWith(200);
  });


});
