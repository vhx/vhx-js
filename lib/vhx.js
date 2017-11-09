import ApiConfig from './config';
import Collection from './resources/collections';
import Video from './resources/videos';
import Customer from './resources/customers';
import Browse from './resources/browse';
import Product from './resources/products';
import Analytics from './resources/analytics';

const resources = {
  products    : Product,
  browse      : Browse,
  videos      : Video,
  collections : Collection,
  customers   : Customer,
  analytics   : Analytics
};

if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return new Buffer(str).toString('base64');
  }
}

class VhxApi {
  constructor(key, opts={}) {
    this.api = opts.internal ? this.setToken(key, opts) : this.setApi(key, opts);

    this.prepareResources();
  }

  setApi(key, opts = {}) {
    return {
      auth: 'Basic ' + btoa(key),
      host: opts.host || ApiConfig.HOST,
      protocol: opts.protocol || ApiConfig.PROTOCOL,
      timeout: ApiConfig.TIMEOUT,
      token_expiration: null
    };
  }

  setToken(key, opts = {}) {
    return {
      token: key,
      host: opts.host || ApiConfig.HOST,
      protocol: opts.protocol || ApiConfig.PROTOCOL,
      timeout: opts.timeout || ApiConfig.TIMEOUT,
      token_expiration: opts.TOKEN_EXPIRES_IN || ApiConfig.TOKEN_EXPIRES_IN,
      internal: true
    };
  }

  prepareResources() {
    for (const name in resources) {
      this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this.api);
    }
  }
}

export default VhxApi;
