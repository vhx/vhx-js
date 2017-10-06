import Resource from '../resource';

class Collection extends Resource {
  constructor(api) {
    super(
      api,
      'collections',
      process.env.NODE_BUILD ?
        [ 'all', 'retrieve', 'items', 'update', 'create' ] :
        [ 'all', 'retrieve', 'items' ]
    );
  }
};

export default Collection;
