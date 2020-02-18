"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var handleNotFound = function handleNotFound(req, res) {
  return regeneratorRuntime.async(function handleNotFound$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.status(404).json({
            data: null,
            included: null,
            code: 404
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = handleNotFound;
exports.default = _default;