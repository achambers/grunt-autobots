'use strict';

var grunt = require('grunt');
var RSVP = require('rsvp');
var redis = require('redis');
var MESSAGES = require('./constants/messages');

var RolloutIndexTask = function(config) {
  this._config = {};

  for (var prop in config) {
    this._config[prop] = config[prop];
  }
};

RolloutIndexTask.prototype = {
  run: function() {
    var config = this.getConfig();

    return new RSVP.Promise(function(resolve, reject) {
      if (typeof config === 'object') {
        var key = 'index:' + config.hash;
        var indexFilePath = config.distDir + '/index.html';

        if (!grunt.file.exists(indexFilePath)) {
          grunt.log.error(MESSAGES.INDEX_FILE_NOT_LOCATED.message.replace('{a}', indexFilePath));
          reject(MESSAGES.INDEX_FILE_NOT_LOCATED.message.replace('{a}', indexFilePath));
        }

        var data = grunt.file.read(indexFilePath);

        grunt.log.ok(MESSAGES.INDEX_LOCATED.message.replace('{a}',indexFilePath));

        var client = redis.createClient(config.redisPort, config.redisHost, {
          auth_pass: config.redisPassword
        });

        client.on('error', function(error) {
          grunt.log.error('Redis error occured', error);
        });

        client.on('ready', function() {
          grunt.log.ok(MESSAGES.CONNECTED_TO_REDIS.message.replace('{a}', config.redisHost).replace('{b}', config.redisPort));
        });

        client.set(key, data, function(error, response) {
          grunt.log.ok(MESSAGES.INDEX_UPLOADED.message.replace('{a}', key));

          grunt.log.subhead(MESSAGES.TO_PREVIEW.message);
          grunt.log.writeln(MESSAGES.PREVIEW_URL.message.replace('{a}', config.appUrl).replace('{b}', config.hash));

          grunt.log.subhead(MESSAGES.TO_ACTIVATE.message);
          grunt.log.writeln(MESSAGES.ACTIVATION_TASK.message.replace('{a}', config.hash));

          resolve();
        });
      } else {
        reject(config);
      }
    });
  },

  getConfig: function() {
    var autobotsConfig = this._config;
    var defaultDistDir = autobotsConfig.defaultDistDir || 'dist'; //defaultDistDir is for testing purposes only
    var distDir = autobotsConfig.distDir;
    var appUrl = autobotsConfig.appUrl || 'http://<your-app-url>';
    var hash = process.env.CIRCLE_SHA1;
    var redisConfig = autobotsConfig.redis || {
      host: '127.0.0.1',
      port: '6379',
      password: null
    };

    if (!distDir) {
      distDir = defaultDistDir;
    }

    grunt.log.ok(MESSAGES.USING_DIST_DIR.message.replace('{a}', distDir));

    if (!grunt.file.exists(distDir)) {
      grunt.log.error(MESSAGES.DIST_DIR_DOES_NOT_EXIST.message.replace('{a}', distDir));
      return MESSAGES.DIST_DIR_DOES_NOT_EXIST.message.replace('{a}', distDir);
    }

    if (!hash) {
      grunt.log.error(MESSAGES.MISSING_SHA.message);
      return MESSAGES.MISSING_SHA.message;
    }

    return {
      appUrl: appUrl,
      hash: hash,
      distDir: distDir,
      redisHost: redisConfig.host,
      redisPort: redisConfig.port,
      redisPassword: redisConfig.password
    }
  }
};

module.exports = RolloutIndexTask;
