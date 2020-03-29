import getLambdaEvent from './getLambdaEvent';
import getLambdaContext from './getLambdaContext';

const asLambda = handler => async (req, res) => {
  const event = getLambdaEvent(req, res);
  const context = getLambdaContext(req, res);
  const payload = await handler(event, context);
  switch (payload?.headers['content-type']) {
    case 'text/html': {
      res.send(payload.body);
      break;
    }
    case 'application/json': {
      res.json(JSON.parse(payload.body));
      break;
    }
    case 'application/javascript': {
      res.send(payload.body);
      break;
    }
    default: {
      res.json(payload);
    }
  }
};

export default asLambda;
