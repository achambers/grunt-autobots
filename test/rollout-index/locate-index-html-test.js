'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var RolloutIndexTask = require('../../tasks/lib/rollout-index-task');
var config;

exports.locate_index_html = {
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

  index_html_exists: function(test) {
    test.expect(1);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.ok.calledWith('index.html file located: "test/fixtures/dist/index.html"'));
    })
    .finally(test.done);
  },

  index_html_does_not_exist: function(test) {
    test.expect(1);

    config.distDir = 'test/fixtures';

    var subject = new RolloutIndexTask(config);

    subject.run().catch(function() {
      test.ok(grunt.log.error.calledWith('index.html file could not be located: "test/fixtures/index.html"'));
    })
    .finally(test.done);
  }
};

