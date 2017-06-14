import Resource from '../resource';

class Customer extends Resource {
  constructor(api) {
    if (process.env.NODE_BUILD) {
      super(api, 'customers', [
        'retrieve', 'all',
        'watching', 'watchlist',
        'create', 'update',
        'delete', 'addProduct',
        'removeProduct'
      ]);
    } else {
      super(api, 'customers', ['retrieve', 'all', 'watching', 'watchlist']);
    }
  }
};

export default Customer;
