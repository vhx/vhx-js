import Resource from '../resource';

class Authorizations extends Resource {
  constructor(api) {
    super(api, 'authorizations', ['create']);
  }
};

export default Authorizations;
