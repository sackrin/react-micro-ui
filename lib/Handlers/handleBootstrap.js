"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var handleBootstrap = function handleBootstrap(_ref) {
  var name = _ref.name,
      assets = _ref.assets,
      api = _ref.api,
      manifest = _ref.manifest,
      environments = _ref.environments;
  return (/*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var manifestData, contents;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Retrieve the manifest file contents
              manifestData = _fs.default.readFileSync(manifest.filepath, 'utf8'); // Replace the bootstrap JS placeholder tokens with permitted environment variables
              // This will be used by bootstrap and communicated within the window space to the built micro UI assets

              contents = _fs.default.readFileSync(_path.default.join(__dirname, '../../assets', 'bootstrap.js'), 'utf8');
              contents = contents.replace(/__MANIFEST__/g, manifestData);
              contents = contents.replace(/__ENV__/g, JSON.stringify({
                name: name,
                apiUrl: api.url,
                apiPath: api.path,
                assetUrl: assets.url || api.url,
                assetTarget: assets.target,
                assetEntry: manifest.entry || 'main.js'
              })); // WARNING! Try everything we can to make sure the assets are NOT cached
              // This is the worst file to have cached, ensure this file does not cache

              return _context.abrupt("return", {
                headers: {
                  'content-type': 'application/javascript',
                  expires: '-1',
                  'cache-control': 'private, no-cache, no-store, must-revalidate',
                  pragma: 'no-cache'
                },
                contentType: 'text',
                body: contents,
                status: 200
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))
  );
};

var _default = handleBootstrap;
exports.default = _default;