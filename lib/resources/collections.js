'use strict';

var Resource = require('../resource');

class Collection extends Resource {
  constructor(api) {
    super(api, 'collections', ['all', 'list', 'items']);
  }
};

module.exports = Collection;
