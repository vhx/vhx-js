'use strict';

import request from 'superagent';
import paginate from './paginate';
import {
  generateUrl,
  isObject,
  isCallbackFunction,
} from './helpers';

class Resource {
  constructor(api, path, methods, isToken) {
    this._api    = api;
    this.methods = methods;
    this.path    = path;

    this.init();
  }

  init() {
    this.methods.forEach((item) => {
      let method        = this.getMethod(item);
      let resource_type = this.path || 'id';
      let params = {
        http_method: 'get', // superagent reads 'get' not 'GET'
        client_method: method
      };

      if (method.match(/retrieve|items|files/i)) {
        this[method] = function(parsed_params, callback) {
          if (isCallbackFunction(callback)) {
            params.callback = callback;
          }

          params.options   = parsed_params;
          params.url       = generateUrl(parsed_params);
          params.scope     = item.scope ? item.scope : null;

          this.makeRequest(params);
        };
      }
      else {
        this[method] = function(options, callback) {
          params.options   = options;
          params.url       = generateUrl(options);
          params.callback  = callback;

          this.makeRequest(params);
        };
      }
    });
  }

  getMethod(params) {
    if (isObject(params) && params.method) {
      return params.method;
    } else {
      return params;
    }
  }

  getParams(client_method, url, options, scope, type) {
    let params = {};

    params.timeout = this._api.timeout;
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

    if (this._api.auth) {
      params.headers = {
        'Authorization': this._api.auth
      };
    }

    return params;
  }

  makeRequest(args) {
    const params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

    if (isCallbackFunction(args.options)) {
      args.callback = args.options;
    }

    if (typeof this._api.internal) {
      params.headers = {
        'Authorization': 'Bearer ' + this._api.token
      }

      this.ajaxRequest(args, params);
    } else {
      this.ajaxRequest(args, params);
    }
  }

  ajaxRequest(args, params) {
    request[args.http_method](params.url)
      .withCredentials()
      .set(params.headers || {})
      .set('Content-Type', 'application/json')
      .query(params.qs)
      .end((err, response) => {
        if (err && err.code === 'ETIMEDOUT') {
          this.errorHandler({
            status: 408,
            body: '{"message": "The request timed out.","documentation_url": "http://dev.vhx.tv/docs/api"}',
            callback: (args.callback || '')
          });
        }

        if (!err && response.statusCode >= 200 && response.statusCode < 300) {
          this.successHandler({
            body: response.body || null,
            callback: args.callback,
            options: args.options,
            object: this.path,
            method: args.client_method
          });
        } else {
          this.errorHandler({
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
    const error = JSON.parse(args.body);
    const error_types = {
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
};

export default Resource;
