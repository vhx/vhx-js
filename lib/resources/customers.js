import Resource from '../resource';

class Customer extends Resource {
  constructor(api) {
    super(api, 'customers', ['retrieve', 'all', 'watching', 'watchlist']);
  }
};

export default Customer;
