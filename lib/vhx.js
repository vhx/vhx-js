import ApiConfig from './config';
// import Collection from './resources/collections';
// import Video from './resources/videos';
// import Customer from './resources/customers';
// import Browse from './resources/browse';
import Product from './resources/products';


const resources = {
  products    : Product,
  // collections : Collection,
  // videos      : Video,
  // customers   : Customer,
  // browse      : Browse
};

class VhxApi {
  constructor(key, opts) {
    if (!(this instanceof vhx)) {
      return new vhx(key);
    }

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
      timeout: ApiConfig.TIMEOUT,
      token_expiration: TOKEN_EXPIRES_IN,
      internal: true
    };
  }

  prepareResources() {
    for (let name in resources) {
      this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this.api);
    }
  }
}

export default VhxApi;
