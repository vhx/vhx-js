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

      if (method.match(/update|addItem|addProduct/)) {
        params.http_method = 'put';
      }

      if (method.match(/create/)) {
        params.http_method = 'post';
      }

      if (method.match(/removeItem|removeProduct/)) {
        params.http_method = 'delete';
      }

      if (method.match(/files|items|watching|watchlist/)) {
        params.scope = item;
      }

      if (method.match(/addItem|removeItem/)) {
        params.scope = 'items';
      }

      this[method] = (identifier, options) => {
        params.url = generateUrl(identifier, this, params);

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
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this._api.auth
      };
    }

    if (this._api.internal) {
      params.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._api.token
      }
    }

    return params;
  }

  createRequestParams(args) {
    const params = this.getParams(args.client_method, args.url, args.options, args.scope, args.read_only);

    return this.fetchRequest(args, params);
  }

  fetchRequest(args, params) {
    let url = new URL(params.url);

    if (args.options) {
      Object.keys(args.options).forEach(key => {
        if (args.options[key]) {
          url.searchParams.append(key, args.options[key])
        }
      });
    }

    return fetch(url.href, {
      method: args.http_method,
      headers: params.headers,
      credentials: 'include',
    })
    .then(res => {
      if (res.ok) {
        if (res.status === 204) {
          return {};
        }

        return res.json();
      }

      return Promise.reject({ status: res.status, statusText: res.statusText });
    });
  }
};

export default Resource;
