'use strict';

var grunt = require('grunt');
var ActivateTask = require('../../../tasks/lib/activate-task');
var config;

exports.get_config = {
  setUp: function(done) {
    config = grunt.config('autobots');
    done();
  },

  hash_key_is_specified: function(test) {
    test.expect(1);

    config.key = '123456';

    var subject = new ActivateTask(config);

    var result = subject.getConfig();

    test.equal(result.key, config.key);
    test.done();
  },

  hash_key_is_not_specified: function(test) {
    test.expect(1);

    var subject = new ActivateTask(config);

    var result = subject.getConfig();

    test.equal(result, 'Must supply index key to activate, eg:\n   grunt autobots:activate --key=bcad1324');
    test.done();
  },
};
