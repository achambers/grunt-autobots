/*
 * grunt-autobots
 * https://github.com/achambers/autobots
 *
 * Copyright (c) 2014 Aaron Chambers
 * Licensed under the MIT license.
 */

'use strict';

var redis = require('redis');
var MESSAGES = require('./lib/messages');

module.exports = function(grunt) {
  var RolloutIndexTask = require('./lib/rollout-index-task');

  grunt.registerTask('autobots:rollout:index', 'Publish index.html to Redis', function() {
    var done = this.async();
    var config = grunt.config('autobots');

    var task = new RolloutIndexTask(config);

    task.run().finally(done);
  });
};
