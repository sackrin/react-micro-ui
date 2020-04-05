import fs from 'fs';
import { expect } from 'chai';
import sinon from 'sinon';
import handleLambdaBootstrap from '../handleLambdaBootstrap';
import config from '../../microui.default.config';

describe('Lambda/handleLambdaBootstrap', () => {
  const mockEvent = {};
  const mockContext = {};

  it('can correctly output a bootstrap response formatted for lambda', async () => {
    const fileSync = sinon.stub();
    fileSync.onFirstCall().returns(JSON.stringify({ main: 'main.js' }));
    fileSync
      .onSecondCall()
      .returns('Example text const manifest = __MANIFEST__ and const env = __ENV__ instead of bootstrap.js');
    fs.readFileSync = fileSync;
    const payload = await handleLambdaBootstrap({ testEnvVar: true }, config)(mockEvent, mockContext);
    expect(payload).to.deep.equal({
      headers: {
        'cache-control': 'private, no-cache, no-store, must-revalidate',
        'content-type': 'application/javascript',
        'expires': '-1',
        'pragma': 'no-cache',
      },
      body: 'Example text const manifest = {"main":"main.js"} and const env = {"name":"exampleMicroUI","apiUrl":"http://localhost:9000","apiPath":"/api/v1","assetUrl":"http://localhost:9000","assetTarget":"umd","assetEntry":"main.js"} instead of bootstrap.js',
      statusCode: 200,
    });
  });
});
