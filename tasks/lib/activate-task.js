'use strict';

var grunt = require('grunt');
var RSVP = require('rsvp');
var redis = require('redis');
var MESSAGES = require('./constants/messages');

var ActivateTask = function(config) {
  this._config = {};

  for (var prop in config) {
    this._config[prop] = config[prop];
  }
};

ActivateTask.prototype = {
  run: function() {
    var config = this.getConfig();

    return new RSVP.Promise(function(resolve, reject) {
      if (typeof config === 'object') {
        var key = config.key;
        var redisKey = 'index:' + key;

        grunt.log.debug(MESSAGES.USING_KEY.message.replace('{a}', redisKey));

        var client = redis.createClient();

        client.on('ready', function() {
          grunt.log.debug('Connected to Redis');
        });

        client.on('error', function(error) {
          grunt.fail.fatal('Redis error occured', error);
        });

        client.get(redisKey, function(error, data) {
          if (error) {
            reject(MESSAGES.REDIS_ERROR.message.replace('{a}', error));
          } else {
            if (!data) {
              reject(MESSAGES.INDEX_ENTRY_DOES_NOT_EXIST_FOR_KEY.message.replace('{a}', key));
            } else {
              client.set('index:current', data, function(err) {
                if (err) {
                  reject(error);
                }

                grunt.log.subhead('Success');
                grunt.log.writeln('Release [' + key + '] successfully activated');
                resolve();
              });
            }
          }
        });
      } else {
        reject(config);
      }
    });
  },

  getConfig: function() {
    var autobotsConfig = this._config;
    var key = autobotsConfig.key;

    if (!key) {
      return MESSAGES.KEY_NOT_SUPPLIED.message;
    }

    return {
      key: key
    }
  }
};

module.exports = ActivateTask;
