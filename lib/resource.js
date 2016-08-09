'use strict';

const request = require('superagent');
const defaults = require('./defaults');

class Resource {
  constructor(api, path, methods, isToken) {
    let _this     = this;
    _this._api    = api;
    _this.methods = methods;
    _this.path    = path;

    _this.init();
  }

  init() {
    let _this = this;

    _this.methods.forEach(function(item) {
      let method = _this.getMethod(item),
          type = _this.getType(_this.path),
          params = {
            http_method: 'get', // superagent reads 'get' not 'GET'
            client_method: method
          };

      if (method.match(/retrieve|items|files/i)) {
        _this[method] = function(a, b, c) {
          if (a[type]) {
           if (_this.isCallbackFunction(b)) {
             params.callback = b;
           }
            params.id = _this.parseHref(a[type]);
            delete a[type];
            params.options = a;
          }
          else {
            params.id = _this.parseHref(a);
            if (_this.isCallbackFunction(b)) {
              params.callback = b;
            } else {
              params.options = b;
              params.callback = c;
            }
          }

          params.scope = item.scope ? item.scope : null;
          _this.makeRequest(params);
        };
      }
      else {
        _this[method] = function(options, callback) {
          params.options = options;
          params.callback = callback;

          _this.makeRequest(params);
        };
      }
    });
  }

  getType(resource) {
    if (resource === 'collections') {
      return 'collection';
    }
    if (resource === 'customers') {
      return 'customer';
    }
    if (resource === 'videos') {
      return 'video';
    }

    return 'id';
  }

  getMethod(params) {
    let _this = this;

    if (_this.isObject(params) && params.method) {
      return params.method;
    } else {
      return params;
    }
  }

  parseHref(href) {
    let _this = this,
        val;

    if (parseInt(href, 10)) {
      return href;
    }
    else if (href.indexOf(_this._api.host) >= 0) {
      if (href.substr(-1) === '/') {
        href.substr(0, href.length-1);
      }
      val = href.split('/');
      return val[val.length-1];
    }
  }

  getToken(cb) {
    let _this = this;
    let path  = '/admin/collections/token';

    request.get(path)
      .then(function(data) {
        _this._api.token = JSON.parse(data.text).token;
        if (cb) cb();
      }, function(data) {
        console.log(data);
      });
  }

  timeStamp() {
    return new Date().getTime();
  }

  getParams(client_method, id, options, scope) {
    let _this = this,
        params = {};

    params.url = _this._api.protocol + _this._api.host + '/' + _this.path;
    params.timeout = _this._api.timeout;

    if (_this._api.auth) {
      params.headers = {
        'Authorization': _this._api.auth
      };
    }

    params.qs = options || null;

    if (!client_method.match(/^list$|^all$/)) {
      params.url += '/' + id;
    }

    if (client_method.match(/items/i)) {
      params.url += '/items';
    }

    if (client_method.match(/files/i)) {
      params.url += '/files';
    }

    if (scope) {
      params.url += '/' + scope;
    }

    return params;
  }

  makeRequest(args) {
    let _this = this;
    let params = _this.getParams(args.client_method, args.id || null, args.options, args.scope);

    if (_this.isCallbackFunction(args.options)) {
      args.callback = args.options;
    }

    if (_this._api.token !== undefined) {
      _this.getToken(()=> {
        params.headers = {
          'Authorization': 'Bearer ' + _this._api.token
        }

        _this.ajaxRequest(args, params);
      });
    } else {
      _this.ajaxRequest(args, params);
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
            callback: args.callback
          });
        }

        if (!err && response.statusCode >= 200 && response.statusCode < 300) {
          _this.successHandler({
            body: response.body || null,
            callback: args.callback
          });
        } else {
          _this.errorHandler({
            status: 408,
            body: '{"message": "The request timed out.","documentation_url": "http://dev.vhx.tv/docs/api"}',
            callback: args.callback
          });
        }
      });
  }

  successHandler(args) {
    args.callback(false, args.body);
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
    args.callback(error, null);
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
