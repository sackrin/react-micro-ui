const path = require('path');

module.exports = {
  name: 'exampleMicroUI',
  assets: {
    target: 'umd',
    url: 'http://localhost:9000',
  },
  manifest: {
    filepath: path.join(process.cwd(), '.microui', 'manifest.json'),
    entry: 'main.js',
  },
  api: {
    url: 'http://localhost:9000',
    path: '/api/v1',
    port: 9000,
    trustProxy: 'trust proxy',
    cors: { origin: '*' },
    messages: {
      START_UP: 'API starting',
      STARTED_UP: 'API started and listening on port',
      CRASHED: 'API crashed with message'
    },
  },
  environments: {
    identifier: 'ENV_ID',
    default: 'local',
    profiles: {
      local: {},
      latest: {},
    },
  },
};
