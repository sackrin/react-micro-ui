const mockEvent = (req, res) => ({
  version: '2.0',
  routeKey: `${req.method} ${req.path}`,
  rawPath: req.path,
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,ja;q=0.7,la;q=0.6',
    'content-length': '0',
    host: req.hostname,
    'upgrade-insecure-requests': '1',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
  },
  body: req.body ? JSON.stringify(req.body) : null,
  queryStringParameters: req.query || null,
  requestContext: {
    http: {
      method: req.method,
      path: req.path,
      protocol: 'HTTP/1.1',
      sourceIp: req.ip,
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    },
    routeKey: `${req.method} ${req.path}`,
  },
  isBase64Encoded: false,
});

export default mockEvent;
