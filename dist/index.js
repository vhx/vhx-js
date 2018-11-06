(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VhxApi = factory());
}(this, (function () { 'use strict';

var ApiConfig = {
  HOST: 'api.vhx.tv',
  PROTOCOL: 'https://',
  TIMEOUT: '30000',
  NODE: true,
  TOKEN_EXPIRES_IN: '1800000'
};

function getMethod(params) {
  return isObject(params) && params.method ?
          params.method :
          params;
}

function isHref(params) {
  return params && isNaN(parseInt(params, 10));
}

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

function isFunction(obj) {
  return obj && !!(obj && obj.constructor && obj.call && obj.apply);
}

function generateUrl(params, resource, options) {
  if (resource.path === 'products') {
    return createUrlWithCustomEndpoints(params, resource, options);
  }

  if (resource.path === 'videos') {
    return createUrlWithCustomEndpoints(params, resource, options);
  }

  if (resource.path === 'collections') {
    return createUrlWithCustomEndpoints(params, resource, options);
  }

  if (resource.path === 'customers') {
    return createUrlWithCustomEndpoints(params, resource, options);
  }

  if (resource.path === 'browse') {
    return handleBrowseEndpoint(params, resource);
  }

  return returnDefaultHref(resource);
}

var handleBrowseEndpoint = function (params, resource) {

  if (isObject(params)) {
    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path));
  }

  return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "?product=" + params);
};

var createUrlWithCustomEndpoints = function (params, resource, options) {
  if (options && options.scope && options.scope !== 'items') {
    if (params && isHref(params)) {
      return (params + "/" + (options.scope));
    }

    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "/" + params + "/" + (options.scope));
  }

  if (options && options.scope && options.scope === 'items') {
    if (params && isHref(params)) {
      return params;
    }

    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "/" + params + "/" + (options.scope));
  }

  if (params && isHref(params) && !isFunction(params) && !isObject(params)) {
    return params;
  }

  if (params && !isFunction(params) && !isObject(params)) {
    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "/" + params);
  }

  return returnDefaultHref(resource);
};

var returnDefaultHref = function (resource) {
  return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path));
};

var Resource = function Resource(api, path, methods, isToken) {
  this._api  = api;
  this.methods = methods;
  this.path  = path;

  this.init();
};

Resource.prototype.init = function init () {
    var this$1 = this;

  this.methods.forEach(function (item) {
    var method = getMethod(item);
    var params = {
      http_method: 'get', // superagent reads 'get' not 'GET'
      client_method: method
    };

    if (method.match(/update|addItem|addProduct/)) {
      params.http_method = 'put';
    }

    if (method.match(/create/)) {
      params.http_method = 'post';
    }

    if (method.match(/removeItem|removeProduct|delete/)) {
      params.http_method = 'delete';
    }

    if (method.match(/files|items|watching|watchlist/)) {
      params.scope = item;
    }

    if (method.match(/addItem|removeItem/)) {
      params.scope = 'items';
    }

    this$1[method] = function (identifier, options) {
      params.url = generateUrl(identifier, this$1, params);

      /**
       * The param types being passed into the client library can vary based on the endpoint.
       * For example, the products/all endpoint, can take an optional object as it's first param:
       * vhx.products.all({per_page: 10})
       *
       * But we also want to make sure we can handle other product endpoints such as:
       * vhx.products.retrieve(14440);
       *
       * or
       *
       * vhx.products.retrieve(14440, { per_page: 10 });
       *
       * We need to check if the initial param is an object or not, so that we can place
       * it into the correct params variable.
      **/
      if (isObject(identifier)) {
        params.options = identifier;
      } else {
        params.options = options;
      }

      return this$1.createRequestParams(params);
    };
  });
};

Resource.prototype.getParams = function getParams (client_method, url, options, scope, type) {
  var params = {
    timeout : this._api.timeout,
    method: client_method,
    url   : url,
  };

  if (isObject(options)) {
    params.qs = options || null;
  }

  if (this._api.auth) {
    params.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this._api.auth
    };
  }

  if (this._api.internal) {
    params.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._api.token
    };
  }

  return params;
};

Resource.prototype.createRequestParams = function createRequestParams (args) {
  var params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

  return this.fetchRequest(args, params);
};

Resource.prototype.fetchRequest = function fetchRequest (args, params) {
  var url = new URL(params.url);

  if (args.options) {
    Object.keys(args.options).forEach(function (key) {
      if (args.options[key]) {
        url.searchParams.append(key, args.options[key]);
      }
    });
  }

  return fetch(url.href, {
    method: args.http_method,
    headers: params.headers,
    credentials: 'include',
  })
  .then(function (res) {
    if (res.ok) {
      if (res.status === 204) {
        return {};
      }

      return res.json();
    }

    return Promise.reject({ status: res.status, statusText: res.statusText });
  });
};

var Collection = /*@__PURE__*/(function (Resource$$1) {
  function Collection(api) {
    Resource$$1.call(
      this, api,
      'collections',
      [ 'all', 'retrieve', 'items', 'update', 'create', 'addItem', 'removeItem' ]
    );
  }

  if ( Resource$$1 ) Collection.__proto__ = Resource$$1;
  Collection.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Collection.prototype.constructor = Collection;

  return Collection;
}(Resource));

var Video = /*@__PURE__*/(function (Resource$$1) {
  function Video(api) {
    Resource$$1.call(
      this, api,
      'videos',
      ['all', 'retrieve', 'files', 'create', 'update']
    );
  }

  if ( Resource$$1 ) Video.__proto__ = Resource$$1;
  Video.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Video.prototype.constructor = Video;

  return Video;
}(Resource));

var Customer = /*@__PURE__*/(function (Resource$$1) {
  function Customer(api) {
    Resource$$1.call(
      this, api,
      'customers',
      ['retrieve', 'all', 'watching', 'watchlist', 'addProduct', 'removeProduct', 'update' ]
    );
  }

  if ( Resource$$1 ) Customer.__proto__ = Resource$$1;
  Customer.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Customer.prototype.constructor = Customer;

  return Customer;
}(Resource));

var Browse = /*@__PURE__*/(function (Resource$$1) {
  function Browse(api) {
    Resource$$1.call(this, api, 'browse', ['list']);
  }

  if ( Resource$$1 ) Browse.__proto__ = Resource$$1;
  Browse.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Browse.prototype.constructor = Browse;

  return Browse;
}(Resource));

var Product = /*@__PURE__*/(function (Resource$$1) {
  function Product(api) {
    Resource$$1.call(this, api, 'products', ['retrieve', 'all', 'create', 'update', 'delete']);
  }

  if ( Resource$$1 ) Product.__proto__ = Resource$$1;
  Product.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Product.prototype.constructor = Product;

  return Product;
}(Resource));

var Analytics = /*@__PURE__*/(function (Resource$$1) {
  function Analytics(api) {
    Resource$$1.call(this, api, 'analytics', ['retrieve']);
  }

  if ( Resource$$1 ) Analytics.__proto__ = Resource$$1;
  Analytics.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Analytics.prototype.constructor = Analytics;

  return Analytics;
}(Resource));

var Subscription = /*@__PURE__*/(function (Resource$$1) {
  function Subscription(api) {
    Resource$$1.call(this, api, 'subscriptions', ['create']);
  }

  if ( Resource$$1 ) Subscription.__proto__ = Resource$$1;
  Subscription.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Subscription.prototype.constructor = Subscription;

  return Subscription;
}(Resource));

var resources = {
  products    : Product,
  browse      : Browse,
  videos      : Video,
  collections : Collection,
  customers   : Customer,
  analytics   : Analytics,
  subscriptions: Subscription,
};

if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return new Buffer(str).toString('base64');
  };
}

var VhxApi = function VhxApi(key, opts) {
  if ( opts === void 0 ) opts={};

  this.api = opts.internal ? this.setToken(key, opts) : this.setApi(key, opts);

  this.prepareResources();
};

VhxApi.prototype.setApi = function setApi (key, opts) {
    if ( opts === void 0 ) opts = {};

  return {
    auth: 'Basic ' + btoa(key),
    host: opts.host || ApiConfig.HOST,
    protocol: opts.protocol || ApiConfig.PROTOCOL,
    timeout: ApiConfig.TIMEOUT,
    token_expiration: null
  };
};

VhxApi.prototype.setToken = function setToken (key, opts) {
    if ( opts === void 0 ) opts = {};

  return {
    token: key,
    host: opts.host || ApiConfig.HOST,
    protocol: opts.protocol || ApiConfig.PROTOCOL,
    timeout: opts.timeout || ApiConfig.TIMEOUT,
    token_expiration: opts.TOKEN_EXPIRES_IN || ApiConfig.TOKEN_EXPIRES_IN,
    internal: true
  };
};

VhxApi.prototype.prepareResources = function prepareResources () {
  for (var name in resources) {
    this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this.api);
  }
};

return VhxApi;

})));
//# sourceMappingURL=index.js.map
