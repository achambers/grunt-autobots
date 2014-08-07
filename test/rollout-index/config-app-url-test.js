'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var RolloutIndexTask = require('../../tasks/lib/rollout-index-task');
var config;

exports.config_app_url = {
  setUp: function(done) {
    config = grunt.config('autobots');

    process.env.CIRCLE_SHA1 = 'abc123';
    sinon.spy(grunt.log, 'writeln');
    done();
  },
  tearDown: function(done) {
    grunt.log.writeln.restore();
    done();
  },

  app_url_is_specified: function(test) {
    test.expect(1);

    config.appUrl = 'http://myapp.com';

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.writeln.calledWith('http://myapp.com?key=abc123'));
    })
    .finally(test.done);
  },

  app_url_is_not_specified: function(test) {
    test.expect(1);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.writeln.calledWith('http://<your-app-url>?key=abc123'));
    }).finally(test.done);
  }
};
