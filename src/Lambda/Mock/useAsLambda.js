import mockEvent from './mockEvent';
import mockContext from './mockContext';

const useAsLambda = handler => async (req, res) => {
  const event = mockEvent(req, res);
  const context = mockContext(req, res);
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

export default useAsLambda;
