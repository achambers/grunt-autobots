'use strict';

module.exports = {
  INDEX_UPLOADED: {
    message: 'index.html uploaded with key: "{a}"'
  },
  INDEX_LOCATED: {
    message: 'index.html file located: "{a}"'
  },
  INDEX_FILE_NOT_LOCATED: {
    message: 'index.html file could not be located: "{a}"'
  },
  TO_PREVIEW: {
    message: 'To Preview:'
  },
  PREVIEW_URL: {
    message: '{a}?key={b}'
  },
  TO_ACTIVATE: {
    message: 'To Activate:'
  },
  ACTIVATION_TASK: {
    message: 'grunt autobots:activate --key={a}'
  },
  USING_DIST_DIR: {
    message: 'Using dist dir: "{a}"'
  },
  DIST_DIR_DOES_NOT_EXIST: {
    message: 'dist dir does not exist: "{a}"'
  },
  MISSING_SHA: {
    message: 'Could not determine current git hash.  Please ensure process.env.CIRCLE_SHA1 is specified'
  },
  CONNECTED_TO_REDIS: {
    message: 'Connected to Redis [{a}:{b}]'
  },
  REDIS_ERROR: {
    message: 'Redis error when getting key: {a}'
  },
  USING_KEY: {
    message: 'Using key: "{a}"'
  },
  KEY_NOT_SUPPLIED: {
    message: 'Must supply index key to activate, eg:\n   grunt autobots:activate --key=bcad1324'
  },
  INDEX_ENTRY_DOES_NOT_EXIST_FOR_KEY: {
    message: 'index.html does not exist for key: "{a}"'
  }
};
