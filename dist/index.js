(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('superagent')) :
	typeof define === 'function' && define.amd ? define(['superagent'], factory) :
	(global.VhxApi = factory(global.request));
}(this, (function (request) { 'use strict';

request = 'default' in request ? request['default'] : request;

var ApiConfig = {
  HOST: 'api.vhx.tv',
  PROTOCOL: 'https://',
  TIMEOUT: '30000'
};

function getMethod(params) {
  return isObject(params) && params.method ?
          params.method :
          params;
}

function isHref(params) {
  return isNaN(parseInt(params, 10));
}

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

function generateUrl(params, resource, options) {
  if (resource.path === 'products') {
    return createUrlWithStandardEndpoints(params, resource);
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
  if (options && options.scope) {
    if (isHref(params)) {
      return (params + "/" + (options.scope));
    }

    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "/" + params + "/" + (options.scope));
  }

  if (params && isHref(params) && !isFunction(params)) {
    return params;
  }

  if (params && !isFunction(params)) {
    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "/" + params);
  }

  return returnDefaultHref(resource);
};

var returnDefaultHref = function (resource) {
  return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path));
};

var createUrlWithStandardEndpoints = function (params, resource) {
  if (isHref(params) && !isFunction(params)) {
    return params;
  }

  if (!isFunction(params)) {
    return ("" + (resource._api.protocol) + (resource._api.host) + "/" + (resource.path) + "/" + params);
  }

  return returnDefaultHref(resource);
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

    if (method.match(/files|items|watching|watchlist/)) {
      params.scope = item;
    }

    this$1[method] = function (options, callback) {
      params.url = generateUrl(options, this$1, params);
      params.options = options;

      if (isFunction(options)) {
       params.callback = options;
      } else {
        params.callback = callback;
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
      'Authorization': this._api.auth
    };
  }

  if (this._api.internal) {
    params.headers = {
      'Authorization': 'Bearer ' + this._api.token
    };
  }

  return params;
};

Resource.prototype.createRequestParams = function createRequestParams (args) {
  var params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

  if (isFunction(args.options)) {
    args.callback = args.options;
  }

  return this.ajaxRequest(args, params);
};

Resource.prototype.ajaxRequest = function ajaxRequest (args, params) {
  var promise = new Promise(function (resolve, reject) {
    var req = function () {
      request[args.http_method](params.url)
        .withCredentials()
        .set(params.headers || {})
        .set('Content-Type', 'application/json')
        .query(params.qs)
        .then(function (response) {
          // TODO: rebuild built-in pagination methods
          // if (args.body.count && args.body.count < args.body.total) {
          // response = new paginate(this, args).get();
          // }

          if (response.ok) {
            resolve(response.body);
          }

          reject(response);
        })
        .catch(function (err) { return reject(err); });
    };

    return req();
  });

  return promise;
};

Resource.prototype.errorHandler = function errorHandler (err) {
  var error_types = {
    400: 'VHXInvalidRequestError',
    401: 'VHXAuthenticationError',
    404: 'VHXResourceNotFound',
    408: 'VHXConnectionError',
    500: 'VHXAPIError'
  };

  return {
    status: err.response.status,
    message: err.response.error,
    docs: "http://dev.vhx.tv/docs/api/"
  }
};

var Collection = (function (Resource$$1) {
  function Collection(api) {
    Resource$$1.call(this, api, 'collections', ['all', 'retrieve', 'items']);
  }

  if ( Resource$$1 ) Collection.__proto__ = Resource$$1;
  Collection.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Collection.prototype.constructor = Collection;

  return Collection;
}(Resource));

var Video = (function (Resource$$1) {
  function Video(api) {
    Resource$$1.call(this, api, 'videos', ['all', 'retrieve', 'files']);
  }

  if ( Resource$$1 ) Video.__proto__ = Resource$$1;
  Video.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Video.prototype.constructor = Video;

  return Video;
}(Resource));

var Customer = (function (Resource$$1) {
  function Customer(api) {
    Resource$$1.call(this, api, 'customers', ['retrieve', 'all', 'watching', 'watchlist']);
  }

  if ( Resource$$1 ) Customer.__proto__ = Resource$$1;
  Customer.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Customer.prototype.constructor = Customer;

  return Customer;
}(Resource));

var Browse = (function (Resource$$1) {
  function Browse(api) {
    Resource$$1.call(this, api, 'browse', ['list']);
  }

  if ( Resource$$1 ) Browse.__proto__ = Resource$$1;
  Browse.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Browse.prototype.constructor = Browse;

  return Browse;
}(Resource));

var Product = (function (Resource$$1) {
  function Product(api) {
    Resource$$1.call(this, api, 'products', ['retrieve', 'all']);
  }

  if ( Resource$$1 ) Product.__proto__ = Resource$$1;
  Product.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Product.prototype.constructor = Product;

  return Product;
}(Resource));

var Analytics = (function (Resource$$1) {
  function Analytics(api) {
    Resource$$1.call(this, api, 'analytics', ['retrieve']);
  }

  if ( Resource$$1 ) Analytics.__proto__ = Resource$$1;
  Analytics.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Analytics.prototype.constructor = Analytics;

  return Analytics;
}(Resource));

var resources = {
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
    timeout: ApiConfig.TIMEOUT,
    token_expiration: TOKEN_EXPIRES_IN,
    internal: true
  };
};

VhxApi.prototype.prepareResources = function prepareResources () {
    var this$1 = this;

  for (var name in resources) {
    this$1[name[0].toLowerCase() + name.substring(1)] = new resources[name](this$1.api);
  }
};

return VhxApi;

})));
//# sourceMappingURL=index.js.map
