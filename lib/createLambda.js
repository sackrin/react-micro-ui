"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _microuiDefault = _interopRequireDefault(require("../microui.default.config"));

var _Handlers = require("./Handlers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createLambda = function createLambda(event, context, callback, _ref) {
  var config = _ref.config,
      _ref$profile = _ref.profile,
      profile = _ref$profile === void 0 ? 'local' : _ref$profile,
      _ref$logger = _ref.logger,
      logger = _ref$logger === void 0 ? console : _ref$logger;

  // Get the combined config
  var _config = _objectSpread({}, _microuiDefault.default, {}, config); // Where we will store the lambda routes


  var routes = []; // Attempt to start the express server

  try {
    // Saying hello
    logger.info(_config.api.messages.START_UP); // Hydrate and output the bootstrapper script

    routes.push(['/bootstrap.js', 'GET', (0, _Handlers.withLambda)((0, _Handlers.handleBootstrap)(profile, _config))]); // Adds a route to a router of sorts

    var route = function route(path, method, handler) {
      // Push into the route queue
      routes.push([path, method, handler]);
    }; // Straps a component into the SSR api


    var strap = function strap(name, component) {
      // Handle a GET request to fetch a component
      routes.push(["/".concat(name), 'GET', (0, _Handlers.strapWithLambda)(name, component, _config, 'GET')]); // Handle a POST request to fetch a component

      routes.push(["/".concat(name), 'POST', (0, _Handlers.strapWithLambda)(name, component, _config, 'POST')]);
    }; // Boots and executes the lambda server


    var boot = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, context, callback) {
        var path, httpMethod, handler, payload;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Retrieve the path and method
                path = event.path, httpMethod = event.httpMethod; // Search for and return the relevant handler
                // @TODO would be cool to use a regex in the future?

                handler = routes.reduce(function (curr, _ref3) {
                  var _ref4 = _slicedToArray(_ref3, 3),
                      _path = _ref4[0],
                      _method = _ref4[1],
                      _handler = _ref4[2];

                  return _path === path && httpMethod === _method ? _handler : curr;
                }, undefined); // Retrieve the payload

                if (!handler) {
                  _context.next = 8;
                  break;
                }

                _context.next = 5;
                return handler(event, context);

              case 5:
                _context.t0 = _context.sent;
                _context.next = 9;
                break;

              case 8:
                _context.t0 = {
                  statusCode: '404',
                  body: JSON.stringify({
                    rah: true
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                };

              case 9:
                payload = _context.t0;
                // Trigger the callback
                callback(null, payload);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function boot(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }(); // Returns the environment vars


    var env = function env() {
      // Retrieve the environment property
      var environments = config.environments; // Retrieve the environment profiles

      return environments.profiles[profile] || environments.profiles[environments.default];
    }; // Returns the instance of the server, the strapper the booter, the config and the logger


    return {
      route: route,
      strap: strap,
      boot: boot,
      env: env,
      config: _config,
      logger: logger
    }; // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_config.api.messages.CRASHED, e.message);
  }
};

var _default = createLambda;
exports.default = _default;