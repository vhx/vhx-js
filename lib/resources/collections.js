import Resource from '../resource';

class Collection extends Resource {
  constructor(api) {
    if (process.env.NODE_BUILD) {
      super(api, 'collections', ['create', 'update', 'all', 'retrieve', 'items']);
    } else {
      super(api, 'collections', ['all', 'retrieve', 'items']);
    }
  }
};

export default Collection;