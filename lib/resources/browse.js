'use strict';

import Resource from '../resource';

class Browse extends Resource {
  constructor(api) {
    super(api, 'browse', ['list']);
  }
};

export default Browse;
