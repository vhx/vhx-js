import {
  isHref,
  isFunction,
  isObject,
} from './utils';

export function generateUrl(params, resource, options) {
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
};

const handleBrowseEndpoint = (params, resource) => {

  if (isObject(params)) {
    return `${resource._api.protocol}${resource._api.host}/${resource.path}`;
  }

  return `${resource._api.protocol}${resource._api.host}/${resource.path}?product=${params}`;
};

const createUrlWithCustomEndpoints = (params, resource, options) => {
  if (options && options.scope) {
    if (isHref(params)) {
      return `${params}/${options.scope}`;
    }

    return `${resource._api.protocol}${resource._api.host}/${resource.path}/${params}/${options.scope}`;
  }

  if (isHref(params) && !isFunction(params)) {
    return params;
  }

  if (!isFunction(params)) {
    return `${resource._api.protocol}${resource._api.host}/${resource.path}/${params}`;
  }

  return returnDefaultHref(resource);
}

const returnDefaultHref = (resource) => {
  return `${resource._api.protocol}${resource._api.host}/${resource.path}`;
}

const createUrlWithStandardEndpoints = (params, resource) => {
  if (isHref(params) && !isFunction(params)) {
    return params;
  }

  if (!isFunction(params)) {
    return `${resource._api.protocol}${resource._api.host}/${resource.path}/${params}`;
  }

  return returnDefaultHref(resource);
}



