'use strict';

var grunt = require('grunt');
var sinon = require('sinon');
var RolloutIndexTask = require('../../tasks/lib/rollout-index-task');
var config;
var redis = require('redis');
var client;

exports.upload_index_to_redis = {
  setUp: function(done) {
    //REDIS
    client = redis.createClient();

    client.on('ready', function() {
      done();
    });

    client.del('index:abc123');

    //ENV VARS
    process.env.CIRCLE_SHA1 = 'abc123';

    //GRUNT CONFIG
    config = grunt.config('autobots');
    config.distDir = 'test/fixtures/dist';
    config.appUrl = 'http://myapp.com';

    //SPIES
    sinon.spy(grunt.log, 'ok');
    sinon.spy(grunt.log, 'subhead');
    sinon.spy(grunt.log, 'writeln');
  },

  tearDown: function(done) {
    grunt.log.ok.restore();
    grunt.log.subhead.restore();
    grunt.log.writeln.restore();
    client.quit();
    done();
  },

  data_is_uploaded_to_redis: function(test) {
    test.expect(1);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      client.get('index:abc123', function(error, data) {
        var expectedData = grunt.file.read('test/fixtures/dist/index.html');
        test.equal(data, expectedData);

        test.done();
      });
    }).catch(test.done);
  },

  notification_of_successful_upload: function(test) {
    test.expect(1);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.ok.calledWith('index.html uploaded with key: "index:abc123"'));
    }).finally(test.done);
  },

  notification_of_preview_url_app_url_not_provided: function(test) {
    test.expect(2);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.subhead.calledWith('To Preview:'));
      test.ok(grunt.log.writeln.calledWith('http://myapp.com?key=abc123'));
    }).finally(test.done);
  },

  notification_of_activation_task: function(test) {
    test.expect(2);

    var subject = new RolloutIndexTask(config);

    subject.run().then(function() {
      test.ok(grunt.log.subhead.calledWith('To Activate:'));
      test.ok(grunt.log.writeln.calledWith('grunt autobots:activate --key=abc123'));
    }).finally(test.done);
  }
};
