'use strict';

var grunt = require('grunt');
var ActivateTask = require('../../../tasks/lib/activate-task');
var config;

exports.get_config = {
  setUp: function(done) {
    config = grunt.config('autobots');

    config.key = '123456';
    config.redis = {
      host: 'jack.redistogo.com',
      port: '1234',
      password: 'blah'
    };

    done();
  },

  hash_key_is_specified: function(test) {
    test.expect(1);

    var subject = new ActivateTask(config);

    var result = subject.getConfig();

    test.equal(result.key, config.key);
    test.done();
  },

  hash_key_is_not_specified: function(test) {
    test.expect(1);

    delete config.key;

    var subject = new ActivateTask(config);

    var result = subject.getConfig();

    test.equal(result, 'Must supply index key to activate, eg:\n   grunt autobots:activate --key=bcad1324');
    test.done();
  },

  redis_config_is_specified: function(test) {
    test.expect(3);

    var subject = new ActivateTask(config);

    var results = subject.getConfig();

    test.equal(results.redisHost, 'jack.redistogo.com');
    test.equal(results.redisPort, '1234');
    test.equal(results.redisPassword, 'blah');

    test.done();
  },

  redis_config_is_not_specified: function(test) {
    test.expect(3);

    delete config.redis;

    var subject = new ActivateTask(config);

    var results = subject.getConfig();

    test.equal(results.redisHost, '127.0.0.1');
    test.equal(results.redisPort, '6379');
    test.equal(results.redisPassword, null);

    test.done();
  }
};
