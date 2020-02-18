"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleBootstrap = function handleBootstrap(_ref) {
  var name = _ref.name,
      url = _ref.url,
      target = _ref.target,
      apiPath = _ref.apiPath,
      manifest = _ref.manifest;
  return function _callee(req, res) {
    var manifestData, contents;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Retrieve the manifest file contents
            manifestData = _fs.default.readFileSync(manifest.filepath, 'utf8'); // Replace the bootstrap JS placeholder tokens with permitted environment variables
            // This will be used by bootstrap and communicated within the window space to the built micro UI assets

            contents = _fs.default.readFileSync(_path.default.join(__dirname, '../../assets', 'bootstrap.js'), 'utf8');
            contents = contents.replace(/__MANIFEST__/g, manifestData);
            contents = contents.replace(/__ENV__/g, JSON.stringify({
              library: name,
              libraryUrl: url,
              libraryTarget: target,
              libraryApiPath: apiPath,
              libraryEntry: manifest.entry || 'main.js'
            })); // WARNING! Try everything we can to make sure the assets are NOT cached
            // This is the worst file to have cached, ensure this file does not cache

            res.setHeader('content-type', 'application/javascript');
            res.setHeader('expires', '-1');
            res.setHeader('cache-control', 'private, no-cache, no-store, must-revalidate');
            res.setHeader('pragma', 'no-cache');
            res.send(contents);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  };
};

var _default = handleBootstrap;
exports.default = _default;