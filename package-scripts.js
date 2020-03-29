const { series, rimraf, mkdirp } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps production',
    clean: {
      description: 'Deletes the various generated folders',
      script: series(rimraf('./assets'), rimraf('./lib')),
    },
    deploy: {
      description: 'Builds the assets',
      default: series('npx nps deploy.build'),
      watch: 'nodemon --watch src --exec npx nps deploy',
      build: series('npx nps clean', 'npx nps deploy.lib', 'npx nps deploy.assets'),
      lib: series(mkdirp('lib'), `npx babel src --config-file ./babel.lib.config.json --out-dir ./lib`),
      assets: series(mkdirp('lib/bootstrap'), `npx webpack --config ./webpack.config.js`),
    },
  },
};
