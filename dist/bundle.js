(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('superagent')) :
	typeof define === 'function' && define.amd ? define(['superagent'], factory) :
	(global.VhxApi = factory(global.request));
}(this, (function (request) { 'use strict';

request = 'default' in request ? request['default'] : request;

var ApiConfig = {
  HOST: 'api.vhx.tv',
  PROTOCOL: 'https://',
  API_VERSION: require('../package.json').version,
  TIMEOUT: '30000'
};

var Paginate = function Paginate(resource, args) {
  var _this = this;

  _this.resource = resource;
  _this.response = args.body;
  _this.options= args.options;
  _this.page   = _this.options.page ? _this.options.page : 1;
  _this.method = args.method;
  _this.last   = Math.ceil(args.body.total / (args.body.count * _this.page));

  ['nextPage','previousPage','firstPage','lastPage'].map(function(key) {
    _this.response[key] = function(callback) {
      _this[key](_this, callback);
    };
  });

  _this.response.goToPage = function(num, callback) {
    _this.goToPage(_this, num, callback);
  };

  _this.response.merge = function(_this) {
    _this._embedded[_this.object] = this._embedded[_this.object].concat(_this._embedded[_this.object]);
    _this.count = this.count + _this.count;

    return _this;
  };
};

Paginate.prototype.get = function get () {
  var _this = this;

  return _this.response;
};

Paginate.prototype.nextPage = function nextPage (_this, callback) {
  _this.options.page = _this.page + 1;

  if (_this.options.page > _this.last) {
    throw 'No more pages to request';
  }

  _this.resource[_this.method](_this.options, callback);
};

Paginate.prototype.previousPage = function previousPage (_this, callback) {
  if (_this.page === 1) {
    throw 'No previous pages to request';
  }

  _this.options.page = _this.page - 1;
  _this.resource[_this.method](_this.options, callback);
};

Paginate.prototype.firstPage = function firstPage (_this, callback) {
  _this.options.page = 1;
  _this.resource[_this.method](_this.options, callback);
};

Paginate.prototype.lastPage = function lastPage (_this, callback) {
  _this.options.page = _this.last;
  _this.resource[_this.method](_this.options, callback);
};

Paginate.prototype.goToPage = function goToPage (_this, num, callback) {
  num = parseInt(num, 10);

  if (num > 0 && num <= _this.last) {
    _this.options.page = num;
    return _this.resource[_this.method](_this.options, callback);
  }

  throw 'You must pass a valid page number';
};

function generateUrl(params) {
  if (params && params.collection) {
    return params.collection;
  }

  if (params && params.product) {
    if (!parseInt(params.product, 10)) {
      return params.product;
    }
  }

  if (params && this.path.match(/videos/)) {
    return params;
  }

  if (params && this.path.match(/customers/)) {
    return params;
  }

  return ("" + (this._api.protocol) + (this._api.host) + "/" + (this.path));
}

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

function isCallbackFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

var Resource = function Resource(api, path, methods, isToken) {
  this._api  = api;
  this.methods = methods;
  this.path  = path;

  this.init();
};

Resource.prototype.init = function init () {
    var this$1 = this;

  this.methods.forEach(function (item) {
    var method      = this$1.getMethod(item);
    var resource_type = this$1.path || 'id';
    var params = {
      http_method: 'get', // superagent reads 'get' not 'GET'
      client_method: method
    };

    if (method.match(/retrieve|items|files/i)) {
      this$1[method] = function(parsed_params, callback) {
        if (isCallbackFunction(callback)) {
          params.callback = callback;
        }

        params.options = parsed_params;
        params.url     = generateUrl(parsed_params);
        params.scope   = item.scope ? item.scope : null;

        this.makeRequest(params);
      };
    }
    else {
      this$1[method] = function(options, callback) {
        params.options = options;
        params.url     = generateUrl(options);
        params.callback= callback;

        this.makeRequest(params);
      };
    }
  });
};

Resource.prototype.getMethod = function getMethod (params) {
  if (isObject(params) && params.method) {
    return params.method;
  } else {
    return params;
  }
};

Resource.prototype.needsToken = function needsToken () {
  return new Date() > this._api.token_expiration;
};

Resource.prototype.getParams = function getParams (client_method, url, options, scope, type) {
  var _this= this;
  var params = {};

  params.timeout = _this._api.timeout;
  params.qs    = options || null;
  params.method= client_method;

  if (Object.prototype.toString.call(url) === '[object Object]') {
    params.url = url[Object.keys(url)];
  } else {
    params.url = url;
  }

  if (params.url.match(/videos|customers/) && !params.url.match(/watching|watchlist/)) {
    params.qs = '';
  }

  if (client_method === 'all') {
    params.qs = '';
  }

  if (client_method === 'all' && options && parseInt(options.product, 10)) {
    params.qs = options;
  }

  if (_this._api.auth) {
    params.headers = {
      'Authorization': _this._api.auth
    };
  }

  return params;
};

Resource.prototype.makeRequest = function makeRequest (args) {
  var params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

  if (isCallbackFunction(args.options)) {
    args.callback = args.options;
  }

  if (typeof this._api.token_host !== undefined) {
    params.headers = {
      'Authorization': 'Bearer ' + this._api.token
    };

    this.ajaxRequest(args, params);
  } else {
    this.ajaxRequest(args, params);
  }
};

Resource.prototype.ajaxRequest = function ajaxRequest (args, params) {
    var this$1 = this;

  request[args.http_method](params.url)
    .withCredentials()
    .set(params.headers || {})
    .set('Content-Type', 'application/json')
    .query(params.qs)
    .end(function (err, response) {
      if (err && err.code === 'ETIMEDOUT') {
        this$1.errorHandler({
          status: 408,
          body: '{"message": "The request timed out.","documentation_url": "http://dev.vhx.tv/docs/api"}',
          callback: (args.callback || '')
        });
      }

      if (!err && response.statusCode >= 200 && response.statusCode < 300) {
        this$1.successHandler({
          body: response.body || null,
          callback: args.callback,
          options: args.options,
          object: this$1.path,
          method: args.client_method
        });
      } else {
        this$1.errorHandler({
          status: 408,
          body: '{"message": "The request timed out.","documentation_url": "http://dev.vhx.tv/docs/api"}',
          callback: (args.callback || '')
        });
      }
    });
};

Resource.prototype.successHandler = function successHandler (args) {
  var response = args.body;

  if (args.body.count && args.body.count < args.body.total) {
    response = new Paginate(this, args).get();
  }

  response.object = args.object;

  if (args.callback) {
    args.callback(false, response);
  }
};

Resource.prototype.errorHandler = function errorHandler (args) {
  var error = JSON.parse(args.body);
  var error_types = {
    400: 'VHXInvalidRequestError',
    401: 'VHXAuthenticationError',
    404: 'VHXResourceNotFound',
    408: 'VHXConnectionError',
    500: 'VHXAPIError'
  };

  error.status = args.status;
  error.type = error_types[error.status];

  if (args.callback) {
    args.callback(error, null);
  }
};

var Product = (function (Resource$$1) {
  function Product(api) {
    Resource$$1.call(this, api, 'products', ['retrieve', 'all']);
  }

  if ( Resource$$1 ) Product.__proto__ = Resource$$1;
  Product.prototype = Object.create( Resource$$1 && Resource$$1.prototype );
  Product.prototype.constructor = Product;

  return Product;
}(Resource));

// import Collection from './resources/collections';
// import Video from './resources/videos';
// import Customer from './resources/customers';
// import Browse from './resources/browse';
var resources = {
  products    : Product,
  // collections : Collection,
  // videos      : Video,
  // customers   : Customer,
  // browse      : Browse
};

var VhxApi = function VhxApi(key, opts) {
  if (!(this instanceof vhx)) {
    return new vhx(key);
  }

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
