import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import handleExpressStrap from '../handleExpressStrap';
import config from '../../microui.default.config';

describe('Express/handleExpressStrap', () => {
  const ExampleComponent = props => <div>{props.name}</div>;

  it('can correctly out a server side rendered component with GET variables', async () => {
    const mockReq = {
      query: { name: 'John Cater' },
      body: {},
    };
    const mockRes = {
      set: sinon.fake(),
      send: sinon.fake(),
      sendStatus: sinon.fake(),
    };
    await handleExpressStrap('ExampleComponent', ExampleComponent, console, {}, config, 'GET')(mockReq, mockRes);
    expect(mockRes.set).to.have.been.calledWith('Content-Type', 'text/html');
    jestExpect(mockRes.send).toMatchSnapshot();
    expect(mockRes.sendStatus).to.have.been.calledWith(200);
  });

  it('can correctly out a server side rendered component with POST variables', async () => {
    const mockReq = {
      query: {},
      body: { name: 'Mark Green' },
    };
    const mockRes = {
      set: sinon.fake(),
      send: sinon.fake(),
      sendStatus: sinon.fake(),
    };
    await handleExpressStrap('ExampleComponent', ExampleComponent, console, {}, config, 'POST')(mockReq, mockRes);
    expect(mockRes.set).to.have.been.calledWith('Content-Type', 'text/html');
    jestExpect(mockRes.send).toMatchSnapshot();
    expect(mockRes.sendStatus).to.have.been.calledWith(200);
  });
});
