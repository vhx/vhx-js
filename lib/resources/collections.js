import Resource from '../resource';

class Collection extends Resource {
  constructor(api) {
    super(api, 'collections', ['all', 'retrieve', 'items']);
  }
};

export default Collection;
