"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var withLambda = function withLambda(handler) {
  return (/*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, context) {
        var payload, body, _payload$headers, headers, _payload$status, status, _payload$contentType, contentType;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return handler({
                  body: requestBody,
                  params: requestParams,
                  client: {
                    type: 'lambda',
                    event: event,
                    context: context
                  }
                });

              case 2:
                payload = _context.sent;
                // Deconstruct the express response from the payload
                body = payload.body, _payload$headers = payload.headers, headers = _payload$headers === void 0 ? {} : _payload$headers, _payload$status = payload.status, status = _payload$status === void 0 ? 200 : _payload$status, _payload$contentType = payload.contentType, contentType = _payload$contentType === void 0 ? 'json' : _payload$contentType;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

var _default = withLambda;
exports.default = _default;