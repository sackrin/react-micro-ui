"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var withExpress = function withExpress(handler) {
  return (/*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var requestBody, requestParams, payload, body, _payload$headers, headers, _payload$status, status, _payload$contentType, contentType;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Retrieve the payload
                // @TODO we should probably fill all express options?
                // @TODO should we wrap this in a try catch?
                // @TODO what happens if this fails?
                requestBody = req.body || {};
                requestParams = req.params || {}; // Pass in the body and the params
                // @TODO is this how we want to handle different types of request data?

                _context.next = 4;
                return handler({
                  body: requestBody,
                  params: requestParams,
                  client: {
                    type: 'express',
                    req: req,
                    res: res
                  }
                });

              case 4:
                payload = _context.sent;
                // Deconstruct the express response from the payload
                body = payload.body, _payload$headers = payload.headers, headers = _payload$headers === void 0 ? {} : _payload$headers, _payload$status = payload.status, status = _payload$status === void 0 ? 200 : _payload$status, _payload$contentType = payload.contentType, contentType = _payload$contentType === void 0 ? 'json' : _payload$contentType; // Add any headers to the response

                Object.entries(headers).reduce(function (curr, _ref2) {
                  var _ref3 = _slicedToArray(_ref2, 2),
                      headerName = _ref3[0],
                      headerValue = _ref3[1];

                  // Set the header
                  curr.setHeader(headerName, headerValue); // Return the res for the next header set

                  return curr;
                }, res); // Set the response status

                res.status(status); // Set the response body

                if (contentType === 'json') {
                  res.json(body);
                } else {
                  res.send(body);
                }

              case 9:
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

var _default = withExpress;
exports.default = _default;