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
    await handleExpressStrap('ExampleComponent', ExampleComponent, {}, config, 'GET')(mockReq, mockRes);
    expect(mockRes.set).to.have.been.calledWith('Content-Type', 'text/html');
    expect(mockRes.send).to.have.been.calledWith('<div data-microui-library="exampleMicroUI" data-microui-component="ExampleComponent"><div data-reactroot="">John Cater</div></div><script type="application/javascript"> (function(n, c, p, t) {  var w = window, m = function(e){   if (e.detail.name === n && w[n] && w[n].Hydrate) {    w[n].Hydrate(document.querySelector(`div[data-microui-component="ExampleComponent"] div[data-reactroot]`),c,p,t);   };  };  if (w[config.name]) { m(); } else { w.addEventListener(\'microUILoaded\', m); }  var d = document.getElementById(`exampleMicroUILibrary`);  if (d === null || d.length === 0) {   var tag = document.createElement(\'script\');   tag.id = `exampleMicroUILibrary`;   tag.src = `http://localhost:9000/bootstrap.js`;   document.body.appendChild(tag);  } })(\'exampleMicroUI\', \'ExampleComponent\', {"name":"John Cater","apiUrl":"http://localhost:9000","apiPath":"/api/v1","assetUrl":"http://localhost:9000","assetTarget":"umd"}, {});</script>');
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
    await handleExpressStrap('ExampleComponent', ExampleComponent, {}, config, 'POST')(mockReq, mockRes);
    expect(mockRes.set).to.have.been.calledWith('Content-Type', 'text/html');
    expect(mockRes.send).to.have.been.calledWith('<div data-microui-library="exampleMicroUI" data-microui-component="ExampleComponent"><div data-reactroot="">Mark Green</div></div><script type="application/javascript"> (function(n, c, p, t) {  var w = window, m = function(e){   if (e.detail.name === n && w[n] && w[n].Hydrate) {    w[n].Hydrate(document.querySelector(`div[data-microui-component="ExampleComponent"] div[data-reactroot]`),c,p,t);   };  };  if (w[config.name]) { m(); } else { w.addEventListener(\'microUILoaded\', m); }  var d = document.getElementById(`exampleMicroUILibrary`);  if (d === null || d.length === 0) {   var tag = document.createElement(\'script\');   tag.id = `exampleMicroUILibrary`;   tag.src = `http://localhost:9000/bootstrap.js`;   document.body.appendChild(tag);  } })(\'exampleMicroUI\', \'ExampleComponent\', {"name":"Mark Green","apiUrl":"http://localhost:9000","apiPath":"/api/v1","assetUrl":"http://localhost:9000","assetTarget":"umd"}, {});</script>');
    expect(mockRes.sendStatus).to.have.been.calledWith(200);
  });

});
