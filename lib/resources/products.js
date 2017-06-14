import Resource from '../resource';

class Product extends Resource {
  constructor(api) {
    super(api, 'products', ['retrieve', 'all']);
  }
};

export default Product;
