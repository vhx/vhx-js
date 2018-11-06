import Resource from '../resource';

class Product extends Resource {
  constructor(api) {
    super(api, 'products', ['retrieve', 'all', 'create', 'update', 'delete']);
  }
};

export default Product;
