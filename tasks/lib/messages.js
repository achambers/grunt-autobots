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
  }
};
