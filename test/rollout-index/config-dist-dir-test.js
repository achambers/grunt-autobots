'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var RolloutIndexTask = require('../../tasks/lib/rollout-index-task');
var config;

exports.config_dist_directory = {
  setUp: function(done) {
    config = grunt.config('autobots');
    process.env.CIRCLE_SHA1 = 'abc123';

    sinon.spy(grunt.log, 'ok');
    sinon.spy(grunt.log, 'error');
    done();
  },

  tearDown: function(done) {
    grunt.log.ok.restore();
    grunt.log.error.restore();
    done();
  },

  use_default_dist_dir_if_not_specified: function(test) {
    test.expect(1);

    var subject = new RolloutIndexTask(config);

    subject.run()
    .then(function() {
      test.ok(grunt.log.ok.calledWith('Using dist dir: "test/fixtures/dist"'));
    })
    .finally(test.done);
  },

  dist_dir_specified_does_not_exist: function(test) {
    test.expect(2);

    config.distDir = 'xxx/dist';

    var subject = new RolloutIndexTask(config);

    subject.run()
    .catch(function() {
      test.ok(grunt.log.ok.calledWith('Using dist dir: "xxx/dist"'));
      test.ok(grunt.log.error.calledWith('dist dir does not exist: "xxx/dist"'));
    }).finally(test.done);
  }
};
