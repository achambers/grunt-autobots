'use strict';

var grunt = require('grunt');
var ActivateTask = require('../../../tasks/lib/activate-task');
var config;
var redis = require('redis');
var client;
var data;

exports.run = {
  setUp: function(done) {
    //GRUNT CONFIG
    config = grunt.config('autobots');

    //REDIS
    client = redis.createClient();

    data = '' + new Date().getTime();
    client.del('index:def456', function(error) {
      if (error) {
        console.log('Error occured deleting key: ', error);
        done();
      } else {
        client.set('index:def456', data, function(err) {
          if (err) {
            console.log('Error occured setting key: ', error);
          }
          done();
        });
      }
    });
  },

  tearDown: function(done) {
    client.quit();
    done();
  },

  index_entry_does_not_exist_for_key: function(test) {
    test.expect(1);

    config.key = 'ppppp';

    var subject = new ActivateTask(config);

    subject.run()
    .catch(function(reason) {
      test.equal(reason, 'index.html does not exist for key: "ppppp"');
    })
    .finally(test.done);
  },

  index_entry_does_exist_for_key: function(test) {
    test.expect(1);

    config.key = 'def456';

    var subject = new ActivateTask(config);

    subject.run()
    .then(function() {
      client.get('index:current', function(error, response) {
        test.equal(response, data);
        test.done();
      });
    });
  }
};
