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
    const payload = await handleLambdaStrap('ExampleComponent', ExampleComponent, console, {}, config, 'GET')(mockEvent, mockContext);
    jestExpect(payload).toMatchSnapshot();
  });

  it('can correctly out a server side rendered component with POST variables', async () => {
    const mockEvent = {
      queryStringParameters: {},
      body: JSON.stringify({ name: 'John Cater' })
    };
    const payload = await handleLambdaStrap('ExampleComponent', ExampleComponent, console, {}, config, 'GET')(mockEvent, mockContext);
    jestExpect(payload).toMatchSnapshot();
  });

});
