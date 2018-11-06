import Resource from '../resource';

class Subscription extends Resource {
  constructor(api) {
    super(api, 'subscriptions', ['create']);
  }
};

export default Subscription;
