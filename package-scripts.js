const { series, rimraf, mkdirp } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps production',
    clean: {
      description: 'Deletes the various generated folders',
      script: rimraf('./lib'),
    },
    codestandards: {
      typing: 'tsc --watch'
    },
    build: {
      description: 'Builds the assets',
      default: series('npx nps clean', 'npx nps build.lib', 'npx nps build.assets'),
      watch: 'nodemon --watch src --exec npx nps build',
      lib: series(mkdirp('lib'), `npx babel src --extensions '.ts,.js' --config-file ./babel.lib.config.json --out-dir ./lib`),
      assets: series(mkdirp('lib/bootstrap'), `npx webpack --config ./webpack.config.js`),
    },
  },
};
