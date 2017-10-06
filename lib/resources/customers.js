import Resource from '../resource';

class Customer extends Resource {
  constructor(api) {
    super(
      api,
      'customers',
      process.env.NODE_BUILD ?
        ['retrieve', 'all', 'watching', 'watchlist', 'addProduct', 'removeProduct', 'update' ] :
        ['retrieve', 'all', 'watching', 'watchlist']
    );
  }
};

export default Customer;
