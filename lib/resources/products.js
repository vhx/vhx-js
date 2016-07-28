'use strict';

var Resource = require('../resource');

class Product extends Resource {
  constructor(api) {
    super(api, 'products', ['retrieve', 'all']);
  }
};

module.exports = Product;
