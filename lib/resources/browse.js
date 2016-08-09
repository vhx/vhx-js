'use strict';

var Resource = require('../resource');

class Browse extends Resource {
  constructor(api) {
    super(api, 'browse', ['all', 'list']);
  }
};

module.exports = Browse;
