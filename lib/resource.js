'use strict';

const request = require('superagent');
const paginate = require('./paginate');

class Resource {
  constructor(api, path, methods, isToken) {
    let _this         = this;
    _this._api        = api;
    _this.methods     = methods;
    _this.path        = path;

    _this.init();
  }

  init() {
    let _this = this;

    _this.methods.forEach(function(item) {
      let method        = _this.getMethod(item);
      let resource_type = _this.path || 'id';
      let params = {
        http_method: 'get', // superagent reads 'get' not 'GET'
        client_method: method
      };

      if (method.match(/retrieve|items|files/i)) {
        _this[method] = function(parsed_params, callback) {
          if (_this.isCallbackFunction(callback)) {
            params.callback = callback;
          }

          params.options   = parsed_params;
          params.url       = this.parseUrl(parsed_params);
          params.scope     = item.scope ? item.scope : null;

          _this.makeRequest(params);
        };
      }
      else {
        _this[method] = function(options, callback) {
          params.options   = options;
          params.url       = this.parseUrl(options);
          params.callback  = callback;

          _this.makeRequest(params);
        };
      }
    });
  }

  parseUrl(params) {
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

    return `${this._api.protocol}${this._api.host}/${this.path}`;
  }

  getMethod(params) {
    let _this = this;

    if (_this.isObject(params) && params.method) {
      return params.method;
    } else {
      return params;
    }
  }

  needsToken() {
    return new Date() > this._api.token_expiration;
  }

  getParams(client_method, url, options, scope, type) {
    let _this  = this;
    let params = {};

    params.timeout = _this._api.timeout;
    params.qs      = options || null;
    params.method  = client_method;

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
  }

  makeRequest(args) {
    let params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

    if (this.isCallbackFunction(args.options)) {
      args.callback = args.options;
    }

    if (typeof this._api.token_host !== undefined) {
      params.headers = {
        'Authorization': 'Bearer ' + this._api.token
      }

      this.ajaxRequest(args, params);
    } else {
      this.ajaxRequest(args, params);
    }
  }

  ajaxRequest(args, params) {
    let _this = this;

    request[args.http_method](params.url)
      .withCredentials()
      .set(params.headers || {})
      .set('Content-Type', 'application/json')
      .query(params.qs)
      .end(function(err, response) {
        if (err && err.code === 'ETIMEDOUT') {
          _this.errorHandler({
            status: 408,
            body: '{"message": "The request timed out.","documentation_url": "http://dev.vhx.tv/docs/api"}',
            callback: (args.callback || '')
          });
        }

        if (!err && response.statusCode >= 200 && response.statusCode < 300) {
          _this.successHandler({
            body: response.body || null,
            callback: args.callback,
            options: args.options,
            object: _this.path,
            method: args.client_method
          });
        } else {
          _this.errorHandler({
            status: 408,
            body: '{"message": "The request timed out.","documentation_url": "http://dev.vhx.tv/docs/api"}',
            callback: (args.callback || '')
          });
        }
      });
  }

  successHandler(args) {
    let response = args.body;

    if (args.body.count && args.body.count < args.body.total) {
      response = new paginate(this, args).get();
    }

    response.object = args.object;

    if (args.callback) {
      args.callback(false, response);
    }
  }

  errorHandler(args) {
    let error = JSON.parse(args.body),
        error_types = {
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
  }

  isCallbackFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  isObject(obj) {
    let type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }
};

module.exports = Resource;
