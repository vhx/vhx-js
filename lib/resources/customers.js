'use strict';

var Resource = require('../resource');

class Customer extends Resource {
  constructor(api) {
    super(api, 'customers', ['retrieve', 'all']);
  }
};

module.exports = Customer;
