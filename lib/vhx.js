import defaults from './defaults';
import Collection from './resources/collections';
import Video from './resources/videos';
import Customer from './resources/customers';
import Product from './resources/products';
import Browse from './resources/browse';
import request from 'superagent';

let resources = {
  collections : Collection,
  videos      : Video,
  products    : Product,
  customers   : Customer,
  browse      : Browse
};

class vhx {
  constructor(key, opts) {
    let _this = this;

    if (!(_this instanceof vhx)) {
      return new vhx(key);
    }

    _this.api = opts.token_host ? _this.setToken(key, opts) : _this.setApi(key, opts);

    _this.prepareResources();
  }

  setApi(key, opts = {}) {
    return {
      auth: 'Basic ' + btoa(key),
      host: opts.host || defaults.HOST,
      protocol: opts.protocol || defaults.PROTOCOL,
      timeout: defaults.TIMEOUT,
      token_expiration: null
    };
  }

  setToken(key, opts = {}) {
    return {
      token: key,
      host: opts.host || defaults.HOST,
      protocol: opts.protocol || defaults.PROTOCOL,
      timeout: defaults.TIMEOUT,
      token_host: opts.token_host || defaults.TOKEN_HOST,
      token_expiration: TOKEN_EXPIRES_IN
    };
  }

  prepareResources() {
    let _this = this;

    for (let name in resources) {
      _this[name[0].toLowerCase() + name.substring(1)] = new resources[name](_this.api);
    }
  }
}

module.exports = vhx;
window.vhx = vhx;
