import React from 'react';
import { expect } from 'chai';
import handleLambdaStrap from '../handleLambdaStrap';
import config from '../../microui.default.config';

describe('Lambda/handleLambdaStrap', () => {
  const mockContext = {};
  const ExampleComponent = props => <div>{props.name}</div>;

  it('can correctly out a server side rendered component with GET variables', async () => {
    const mockEvent = {
      queryStringParameters: { name: 'John Cater' },
      body: JSON.stringify({})
    };
    const payload = await handleLambdaStrap('ExampleComponent', ExampleComponent, {}, config, 'GET')(mockEvent, mockContext);
    expect(payload).to.deep.equal({
      headers: {
        'content-type': 'text/html',
        'expires': '-1',
        'cache-control': 'private, no-cache, no-store, must-revalidate',
        'pragma': 'no-cache'
      },
      body: "<div data-microui-library=\"exampleMicroUI\" data-microui-component=\"ExampleComponent\"><div data-reactroot=\"\">John Cater</div></div><script type=\"application/javascript\"> (function(n, c, p, t) {  var w = window, m = function(e){   if (e.detail.name === n && w[n] && w[n].Hydrate) {    w[n].Hydrate(document.querySelector(`div[data-microui-component=\"ExampleComponent\"] div[data-reactroot]`),c,p,t);   };  };  if (w[config.name]) { m(); } else { w.addEventListener('microUILoaded', m); }  var d = document.getElementById(`exampleMicroUILibrary`);  if (d === null || d.length === 0) {   var tag = document.createElement('script');   tag.id = `exampleMicroUILibrary`;   tag.src = `http://localhost:9000/bootstrap.js`;   document.body.appendChild(tag);  } })('exampleMicroUI', 'ExampleComponent', {\"name\":\"John Cater\",\"apiUrl\":\"http://localhost:9000\",\"apiPath\":\"/api/v1\",\"assetUrl\":\"http://localhost:9000\",\"assetTarget\":\"umd\"}, {});</script>",
      statusCode: 200
    });
  });

  it('can correctly out a server side rendered component with POST variables', async () => {
    const mockEvent = {
      queryStringParameters: {},
      body: JSON.stringify({ name: 'John Cater' })
    };
    const payload = await handleLambdaStrap('ExampleComponent', ExampleComponent, {}, config, 'GET')(mockEvent, mockContext);
    expect(payload).to.deep.equal({
      headers: {
        'content-type': 'text/html',
        'expires': '-1',
        'cache-control': 'private, no-cache, no-store, must-revalidate',
        'pragma': 'no-cache'
      },
      body: "<div data-microui-library=\"exampleMicroUI\" data-microui-component=\"ExampleComponent\"><div data-reactroot=\"\">John Cater</div></div><script type=\"application/javascript\"> (function(n, c, p, t) {  var w = window, m = function(e){   if (e.detail.name === n && w[n] && w[n].Hydrate) {    w[n].Hydrate(document.querySelector(`div[data-microui-component=\"ExampleComponent\"] div[data-reactroot]`),c,p,t);   };  };  if (w[config.name]) { m(); } else { w.addEventListener('microUILoaded', m); }  var d = document.getElementById(`exampleMicroUILibrary`);  if (d === null || d.length === 0) {   var tag = document.createElement('script');   tag.id = `exampleMicroUILibrary`;   tag.src = `http://localhost:9000/bootstrap.js`;   document.body.appendChild(tag);  } })('exampleMicroUI', 'ExampleComponent', {\"name\":\"John Cater\",\"apiUrl\":\"http://localhost:9000\",\"apiPath\":\"/api/v1\",\"assetUrl\":\"http://localhost:9000\",\"assetTarget\":\"umd\"}, {});</script>",
      statusCode: 200
    });
  });

});
