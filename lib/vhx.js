import defaults from './defaults';
import Collection from './resources/collections';
import Video from './resources/videos';
import Customer from './resources/customers';
import Product from './resources/products';
import Browse from './resources/browse';

let resources = {
  collections : Collection,
  videos      : Video,
  products    : Product,
  customer    : Customer,
  browse      : Browse
};

class vhx {
  constructor(key, opts) {
    let _this = this;

    if (!(_this instanceof vhx)) {
      return new vhx(key);
    }

    _this.api = key ? _this.setApi(key, opts) : _this.setToken(opts);
    _this.prepareResources();
  }

  setApi(key, opts = {}) {
    return {
      auth: 'Basic ' + btoa(key),
      host: opts.host || defaults.HOST,
      protocol: opts.protocol || defaults.PROTOCOL,
      timeout: defaults.TIMEOUT
    };
  }

  setToken(opts = {}) {
    return {
      token: null,
      host: opts.host || defaults.HOST,
      protocol: opts.protocol || defaults.PROTOCOL,
      timeout: defaults.TIMEOUT,
      token_host: opts.token_host || defaults.TOKEN_HOST
    };
  }

  prepareResources() {
    let _this = this;

    for (let name in resources) {
      _this[name[0].toLowerCase() + name.substring(1)] = new resources[name](_this.api);
    }
  }
}

window.vhx = vhx;
