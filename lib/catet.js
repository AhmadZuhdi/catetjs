'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Firebase = require('firebase');

var _Firebase2 = _interopRequireWildcard(_Firebase);

var _moment = require('moment');

var _moment2 = _interopRequireWildcard(_moment);

var _fs = require('fs-extra');

var _fs2 = _interopRequireWildcard(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireWildcard(_bluebird);

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireWildcard(_uuid);

/*
* @Author: ahmadzuhdi
* @Date:   2015-10-12 17:05:59
* @Last Modified by:   ahmadzuhdi
* @Last Modified time: 2015-10-12 18:13:07
*/

'use strict';

var Catet = (function () {
  function Catet() {
    var _ref = arguments[0] === undefined ? {} : arguments[0];

    var _ref$level = _ref.level;
    var level = _ref$level === undefined ? 0 : _ref$level;
    var _ref$appKey = _ref.appKey;
    var appKey = _ref$appKey === undefined ? _uuid2['default'].v4() : _ref$appKey;
    var _ref$logPath = _ref.logPath;
    var logPath = _ref$logPath === undefined ? '' + __dirname + '/logs/' + appKey + '.log' : _ref$logPath;
    var _ref$useCloud = _ref.useCloud;
    var useCloud = _ref$useCloud === undefined ? false : _ref$useCloud;

    _classCallCheck(this, Catet);

    /**
     * log level
     * @type {Number}
     * @example
     * 0 = debug
     * 1 = info
     * 2 = warn
     * 3 = error
     * 4 = fatal
     */
    this.level = level;

    /**
     * mapping for level
     * @type {Array}
     */
    this.levelMap = ['debug', 'info', 'warn', 'error', 'fatal'];

    /**
     * app key
     * @type {String}
     */
    this.appKey = appKey;

    /**
     * path of log if cloud is not actived
     * @type {String}
     */
    this.logPath = logPath;

    /**
     * status of using cloud
     * @type {Boolean}
     */
    this.useCloud = useCloud;

    /**
     * firebase object
     * @type {Object}
     */
    this.fb = new _Firebase2['default']('https://catetin.firebaseio.com/' + appKey);

    /**
     * make sure file is exsist
     */
    _fs2['default'].ensureFileSync(logPath);
  }

  _createClass(Catet, [{
    key: 'getLevel',

    /**
     * get log level
     * @return {Number}
     */
    value: function getLevel() {
      return this.level;
    }
  }, {
    key: 'setLevel',

    /**
     * set level of log
     * @param {Number} level
     */
    value: function setLevel() {
      var level = arguments[0] === undefined ? 0 : arguments[0];

      this.level = level;
      return this;
    }
  }, {
    key: 'log',
    value: function log() {
      var _this = this;

      for (var _len = arguments.length, logMessages = Array(_len), _key = 0; _key < _len; _key++) {
        logMessages[_key] = arguments[_key];
      }

      logMessages.map(function (message) {
        _this.writeLog(_this.level, message);
      });

      return this;
    }
  }, {
    key: 'debug',
    value: function debug() {
      var _this2 = this;

      for (var _len2 = arguments.length, logMessages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        logMessages[_key2] = arguments[_key2];
      }

      logMessages.map(function (message) {
        _this2.writeLog(0, message);
      });

      return this;
    }
  }, {
    key: 'info',
    value: function info() {
      var _this3 = this;

      for (var _len3 = arguments.length, logMessages = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        logMessages[_key3] = arguments[_key3];
      }

      logMessages.map(function (message) {
        _this3.writeLog(1, message);
      });

      return this;
    }
  }, {
    key: 'warn',
    value: function warn() {
      var _this4 = this;

      for (var _len4 = arguments.length, logMessages = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        logMessages[_key4] = arguments[_key4];
      }

      logMessages.map(function (message) {
        _this4.writeLog(2, message);
      });

      return this;
    }
  }, {
    key: 'error',
    value: function error() {
      var _this5 = this;

      for (var _len5 = arguments.length, logMessages = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        logMessages[_key5] = arguments[_key5];
      }

      logMessages.map(function (message) {
        _this5.writeLog(3, message);
      });

      return this;
    }
  }, {
    key: 'fatal',
    value: function fatal() {
      var _this6 = this;

      for (var _len6 = arguments.length, logMessages = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        logMessages[_key6] = arguments[_key6];
      }

      logMessages.map(function (message) {
        _this6.writeLog(4, message);
      });

      return this;
    }
  }, {
    key: 'writeLog',
    value: function writeLog(level, message) {
      var timestamp = _moment2['default']().format();
      var type = this.levelMap[level];

      if (this.useCloud) {
        this.writeToClouds({
          timestamp: timestamp,
          message: message,
          level: level,
          type: type
        });
      }

      _fs2['default'].appendFile(this.logPath, '[' + timestamp + ' | ' + level + ' | ' + type + '] :: ' + message + ' \n');
    }
  }, {
    key: 'writeToClouds',
    value: function writeToClouds(message) {
      this.fb.push(message);
      return this;
    }
  }]);

  return Catet;
})();

exports['default'] = Catet;
module.exports = exports['default'];
//# sourceMappingURL=catet.js.map