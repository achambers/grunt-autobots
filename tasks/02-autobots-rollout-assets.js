/*
 * grunt-autobots
 * https://github.com/achambers/autobots
 *
 * Copyright (c) 2014 Aaron Chambers
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var RolloutAssetsTask = require('./lib/rollout-assets-task');

  grunt.registerTask('autobots:rollout:assets', 'Publish assets to S3', function() {
    var done = this.async();
    var config = grunt.config('autobots') || {};

    var task = new RolloutAssetsTask(config);

    task.run()
    .catch(function(reason) {
      grunt.fail.fatal(reason);
    })
    .finally(done);
  });
};

