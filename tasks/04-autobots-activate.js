/*
 * grunt-autobots
 * https://github.com/achambers/autobots
 *
 * Copyright (c) 2014 Aaron Chambers
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var ActivateTask = require('./lib/activate-task');

  grunt.registerTask('autobots:activate', 'Activate index.html', function() {
    var done = this.async();
    var config = grunt.config('autobots') || {};
    config.key = grunt.option('key');

    var task = new ActivateTask(config);

    task.run()
    .catch(function(reason) {
      grunt.fail.fatal(reason);
    })
    .finally(done);
  });
};

