'use strict';

var grunt = require('grunt');
var RSVP = require('rsvp');
var MESSAGES = require('./constants/messages');

var RolloutAssetsTask = function(config, s3) {
  this._config = {};
  this._s3 = s3 || require('s3');

  for (var prop in config) {
    this._config[prop] = config[prop];
  }
};

RolloutAssetsTask.prototype = {
  run: function() {
    var config = this.getConfig();
    var self = this;

    return new RSVP.Promise(function(resolve, reject) {
      if (typeof config === 'object') {
        var distDir = config.distDir;
        var localAssets = config.assets;
        var s3AccessKeyId = config.s3.accessKeyId;
        var s3SecretAccessKey = config.s3.secretAccessKey;
        var s3Bucket = config.s3.bucket;

        if (grunt.option('debug')) {
          grunt.log.debug('Processing the following local assets:');

          localAssets.forEach(function(src) {
            grunt.log.debug(src);
          });
        }

        var client = self._s3.createClient({
          s3Options: {
            accessKeyId: s3AccessKeyId,
            secretAccessKey: s3SecretAccessKey
          }
        });

        var objectList = client.listObjects({
          recursive: false,
          s3Params: {
            Bucket: s3Bucket
          }
        });

        objectList.on('error', function(error) {
          grunt.fail.fatal('S3 error occured: ' + error);
        });

        var remoteAssets = [];
        objectList.on('data', function(data) {
          data['Contents'].forEach(function(object) {
            remoteAssets.push(object['Key']);
          });
        });

        objectList.on('end', function() {
          var promises = {};

          localAssets.forEach(function(asset) {
            promises[asset] = new RSVP.Promise(function(res, rej) {
              if (remoteAssets.indexOf(asset) > -1) {
                res('In sync');
              } else{
                var uploader = client.uploadFile({
                  localFile: distDir + '/' + asset,
                  s3Params: {
                    Bucket: s3Bucket,
                    Key: asset,
                    ACL: 'public-read'
                  }
                });

                uploader.on('error', function(error) {
                  grunt.log.error('Unable to upload: ' + error.stack);
                  rej(error);
                });

                uploader.on('end', function() {
                  res('Uploaded');
                });
              }
            });
          });

          grunt.log.subhead('Uploading to S3');
          RSVP.hashSettled(promises).then(function(results) {
            for (var prop in results) {
              var result = results[prop];

              if (result.state === 'fulfilled') {
                grunt.log.ok(prop + ' > ' + result.value);
              } else {
                grunt.log.error(prop + ' > Failed');
              }
            }

            grunt.log.subhead(MESSAGES.TO_PUBLISH_INDEX.message);
            grunt.log.writeln(MESSAGES.PUBLISH_INDEX_TASK.message);

            resolve();
          });
        });
      } else {
        reject(config);
      }
    });
  },

  getConfig: function() {
    var autobotsConfig = this._config;
    var defaultDistDir = autobotsConfig.defaultDistDir || 'dist'; //defaultDistDir is for testing purposes only
    var distDir = autobotsConfig.distDir;
    var defaultS3Config = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET
    };
    var s3Config = autobotsConfig.s3 || {};

    for(var prop in defaultS3Config) {
      if (!s3Config.hasOwnProperty(prop) || s3Config[prop] === null) {
        s3Config[prop] = defaultS3Config[prop];
      }
    }

    if (!distDir) {
      distDir = defaultDistDir;
    }

    grunt.log.debug(MESSAGES.USING_DIST_DIR.message.replace('{a}', distDir));

    if (!grunt.file.exists(distDir)) {
      return MESSAGES.DIST_DIR_DOES_NOT_EXIST.message.replace('{a}', distDir);
    }

    var assets = grunt.file.expand({
      filter: function(src) {
        return grunt.file.exists(src)
      },
      cwd: distDir
    }, '**/*.{js,css,png,gif,jpg}');

    if (assets.length === 0) {
      return MESSAGES.ASSETS_DO_NOT_EXIST.message.replace('{a}', distDir + '/assets');
    }

    if (!s3Config.accessKeyId) {
      return MESSAGES.S3_ACCESS_KEY_ID_MISSING.message;
    }

    if (!s3Config.secretAccessKey) {
      return MESSAGES.S3_SECRET_ACCESS_KEY_MISSING.message;
    }

    if (!s3Config.bucket) {
      return MESSAGES.S3_BUCKET_MISSING.message;
    }

    return {
      distDir: distDir,
      assets: assets,
      s3: s3Config
    }
  }
};

module.exports = RolloutAssetsTask;
