export function generateUrl(params) {
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
};

export function isObject(obj) {
  const type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

export function isCallbackFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}