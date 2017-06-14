export function getMethod(params) {
  return isObject(params) && params.method ?
          params.method :
          params;
}

export function isHref(params) {
  return params && isNaN(parseInt(params, 10));
}

export function isObject(obj) {
  const type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

export function isFunction(obj) {
  return obj && !!(obj && obj.constructor && obj.call && obj.apply);
}