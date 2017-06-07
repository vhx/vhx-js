import Resource from '../resource';

class Analytics extends Resource {
  constructor(api) {
    super(api, 'analytics', ['retrieve']);
  }
};

export default Analytics;
