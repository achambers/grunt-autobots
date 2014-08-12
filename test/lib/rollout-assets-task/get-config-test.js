'use strict';

var grunt = require('grunt');
var RolloutAssetsTask = require('../../../tasks/lib/rollout-assets-task');
var config;

exports.rollout_assets = {
  setUp: function(done) {
    config = grunt.config('autobots');

    config.s3 = {
      accessKeyId: 'abcd1234',
      secretAccessKey: 'zxcv9876',
      bucket: 'test-bucket',
      region: 'eu-west-1'
    };

    done();
  },

  dist_dir_is_not_specified_and_default_dist_dir_exists: function(test) {
    test.expect(1);

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result.distDir, 'test/fixtures/dist');

    test.done();
  },

  dist_dir_is_not_specified_and_default_dist_dir_does_not_exist: function(test) {
    test.expect(1);

    delete config.defaultDistDir;

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 'dist dir does not exist: "dist"');

    test.done();
  },

  dist_dir_is_specified_and_exists: function(test) {
    test.expect(1);

    delete config.defaultDistDir;
    config.distDir = 'test/fixtures/dist';

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result.distDir, 'test/fixtures/dist');

    test.done();
  },

  dist_dir_is_specified_but_does_not_exist: function(test) {
    test.expect(1);

    delete config.defaultDistDir;
    config.distDir = 'prod-dist';

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 'dist dir does not exist: "prod-dist"');

    test.done();
  },

  assets_dir_does_not_exist: function(test) {
    test.expect(1);

    config.distDir = 'test/fixtures/dist-no-assets-dir';

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 'no assets exist in assets dir: "test/fixtures/dist-no-assets-dir/assets"');

    test.done();
  },

  assets_dir_does_exist_but_is_empty: function(test) {
    test.expect(1);

    config.distDir = 'test/fixtures/dist-no-assets';

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 'no assets exist in assets dir: "test/fixtures/dist-no-assets/assets"');

    test.done();
  },

  assets_dir_does_exist_and_contains_files: function(test) {
    test.expect(4);

    config.distDir = 'test/fixtures/dist';

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result.assets.length, 3);
    test.ok(result.assets.indexOf('assets/test-asset.js') > -1);
    test.ok(result.assets.indexOf('assets/test-asset.css') > -1);
    test.ok(result.assets.indexOf('assets/images/test-asset.png') > -1);

    test.done();
  },

  s3_config_does_exist: function(test) {
    test.expect(4);

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result.s3.accessKeyId, 'abcd1234');
    test.equal(result.s3.secretAccessKey, 'zxcv9876');
    test.equal(result.s3.bucket, 'test-bucket');
    test.equal(result.s3.region, 'eu-west-1');

    test.done();
  },

  s3_config_does_exist_but_access_key_id_does_not: function(test) {
    test.expect(1);

    delete config.s3.accessKeyId;

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 's3.accessKeyId not set');

    test.done();
  },

  s3_config_does_exist_but_secret_access_key_does_not: function(test) {
    test.expect(1);

    delete config.s3.secretAccessKey;

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 's3.secretAccessKey not set');

    test.done();
  },

  s3_config_does_exist_but_bucket_does_not: function(test) {
    test.expect(1);

    delete config.s3.bucket;

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result, 's3.bucket not set');

    test.done();
  },

  s3_config_does_exist_but_region_does_not: function(test) {
    test.expect(1);

    delete config.s3.region;

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result.s3.region, 'us-east-1');

    test.done();
  },

  s3_config_does_not_exist_but_env_vars_do: function(test) {
    test.expect(3);

    delete config.s3;
    process.env.AWS_ACCESS_KEY_ID = 'poiu1234';
    process.env.AWS_SECRET_ACCESS_KEY = 'ytru7654';
    process.env.AWS_BUCKET = 'stage-bucket';

    var subject = new RolloutAssetsTask(config, {});

    var result = subject.getConfig();

    test.equal(result.s3.accessKeyId, 'poiu1234');
    test.equal(result.s3.secretAccessKey, 'ytru7654');
    test.equal(result.s3.bucket, 'stage-bucket');

    test.done();
  }
};
