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
        params.url = generateUrl(options, this, params);
        params.options = options;

        if (isFunction(options)) {
         params.callback = options;
        } else {
          params.callback = callback;
        }

        return this.createRequestParams(params);
      };
    });
  }

  getParams(client_method, url, options, scope, type) {
    const params = {
      timeout : this._api.timeout,
      method  : client_method,
      url     : url,
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
      }
    }

    return params;
  }

  createRequestParams(args) {
    const params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

    if (isFunction(args.options)) {
      args.callback = args.options;
    }

    return this.ajaxRequest(args, params);
  }

  ajaxRequest(args, params) {
    const promise = new Promise((resolve, reject) => {
      const req = () => {
        request[args.http_method](params.url)
          .withCredentials()
          .set(params.headers || {})
          .set('Content-Type', 'application/json')
          .query(params.qs)
          .then((response) => {
            // TODO: rebuild built-in pagination methods
            // if (args.body.count && args.body.count < args.body.total) {
            //   response = new paginate(this, args).get();
            // }

            if (response.ok) {
              resolve(response.body)
            }

            reject(response);
          })
          .catch((err) => reject(err));
      }

      return req();
    });

    return promise;
  }

  errorHandler(err) {
    const error_types = {
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
  }
};

export default Resource;
