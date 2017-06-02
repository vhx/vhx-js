'use strict';

import request from 'superagent';
import { generateUrl } from './urlHelpers';
import {
  getMethod,
  isObject,
  isFunction,
} from './utils';

class Resource {
  constructor(api, path, methods, isToken) {
    this._api    = api;
    this.methods = methods;
    this.path    = path;

    this.init();
  }

  init() {
    this.methods.forEach((item) => {
      const method = getMethod(item);
      const params = {
        http_method: 'get', // superagent reads 'get' not 'GET'
        client_method: method
      };

      if (method.match(/files|items|watching|watchlist/)) {
        params.scope = item;
      }

      this[method] = (options, callback) => {
        params.url       = generateUrl(options, this, params);
        params.callback  = callback;

        this.createRequestParams(params);
      };
    });
  }

  getParams(client_method, url, options, scope, type) {
    let params = {};

    params.timeout = this._api.timeout;
    params.method  = client_method;
    params.url     = url;

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
      }
    }

    return params;
  }

  createRequestParams(args) {
    const params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

    if (isFunction(args.options)) {
      args.callback = args.options;
    }

    this.ajaxRequest(args, params);
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
    const response = args.body;

    // TODO: rebuild built-in pagination methods
    // if (args.body.count && args.body.count < args.body.total) {
    //   response = new paginate(this, args).get();
    // }

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
