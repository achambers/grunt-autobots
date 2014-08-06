'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var RolloutIndexTask = require('../../tasks/lib/rollout-index-task');
var config;

exports.config_redis = {
  setUp: function(done) {
    config = grunt.config('autobots');

    process.env.CIRCLE_SHA1 = 'abc123';
    sinon.spy(grunt.log, 'ok');
    done();
  },
  tearDown: function(done) {
    grunt.log.ok.restore();
    done();
  },

  redis_config_is_specified: function(test) {
    test.expect(1);

    config.redis = {
      host: 'localhost',
      port: '6379'
    };

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.ok.calledWith('Connected to Redis [localhost:6379]'));
    })
    .finally(test.done);
  },

  redis_config_is_not_specified: function(test) {
    test.expect(1);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.ok.calledWith('Connected to Redis [127.0.0.1:6379]'));
    })
    .finally(test.done);
  },
};
