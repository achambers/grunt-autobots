'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var RolloutIndexTask = require('../../../tasks/lib/rollout-index-task');
var config;

exports.env_circle_sha = {
  setUp: function(done) {
    config = grunt.config('autobots');
    sinon.spy(grunt.log, 'ok');
    sinon.spy(grunt.log, 'error');
    done();
  },

  tearDown: function(done) {
    grunt.log.ok.restore();
    grunt.log.error.restore();
    done();
  },

  env_var_exists: function(test) {
    test.expect(1);

    process.env.CIRCLE_SHA1 = 'abc123';

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.ok.calledWith('index.html uploaded with key: "index:abc123"'));
    }).finally(test.done);
  },

  env_var_does_not_exist: function(test) {
    test.expect(1);

    delete process.env.CIRCLE_SHA1;

    var subject = new RolloutIndexTask(config);

    subject.run().catch(function() {
      test.ok(grunt.log.error.calledWith('Could not determine current git hash.  Please ensure process.env.CIRCLE_SHA1 is specified'));
    }).finally(test.done);
  }
};
