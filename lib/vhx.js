import defaults from './defaults';
import Resource from './resource';
import Collection from './resources/collections';
import Video from './resources/videos';
import Customer from './resources/customers'
import Product from './resources/products'

let resources = {
  collections : Collection,
  videos      : Video,
  products    : Product,
  customer    : Customer
};

class vhx {
  constructor(key, isToken) {
    let _this    = this;

    if (!(_this instanceof vhx)) {
      return new vhx(key);
    }

    _this.api = isToken ? _this.setToken(key) : _this.setApi(key);
    _this.prepareResources();
  }

  setApi(key) {
    return {
      auth: 'Basic ' + btoa(key),
      host: defaults.HOST,
      protocol: defaults.PROTOCOL,
      timeout: defaults.TIMEOUT
    }
  }

  setToken(key) {
    return {
      token: null
    }
  }

  prepareResources() {
    let _this = this;

    for (let name in resources) {
      _this[name[0].toLowerCase() + name.substring(1)] = new resources[name](_this.api);
    }
  }
}

window.vhx = vhx;
