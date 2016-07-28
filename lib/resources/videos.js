'use strict';

var Resource = require('../resource');

class Video extends Resource {
  constructor(api) {
    super(api, 'videos', ['all', 'retrieve', 'files']);
  }
};

module.exports = Video;
