!function(t,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):t.VhxApi=o()}(this,function(){"use strict";var e="api.vhx.tv",r="https://",n="30000",i="1800000";function p(t){return t&&isNaN(parseInt(t,10))}function c(t){var o=typeof t;return"function"===o||"object"===o&&!!t}function s(t){return t&&!!(t&&t.constructor&&t.call&&t.apply)}function a(t,o,e){return"products"===o.path?u(t,o,e):"videos"===o.path?u(t,o,e):"collections"===o.path?u(t,o,e):"customers"===o.path?u(t,o,e):"browse"===o.path?function(t,o){if(c(t))return""+o._api.protocol+o._api.host+"/"+o.path;return""+o._api.protocol+o._api.host+"/"+o.path+"?product="+t}(t,o):h(o)}var u=function(t,o,e){return e&&e.scope&&"items"!==e.scope?t&&p(t)?t+"/"+e.scope:""+o._api.protocol+o._api.host+"/"+o.path+"/"+t+"/"+e.scope:e&&e.scope&&"items"===e.scope?t&&p(t)?t:""+o._api.protocol+o._api.host+"/"+o.path+"/"+t+"/"+e.scope:t&&p(t)&&!s(t)&&!c(t)?t:!t||s(t)||c(t)?h(o):""+o._api.protocol+o._api.host+"/"+o.path+"/"+t},h=function(t){return""+t._api.protocol+t._api.host+"/"+t.path},t=function(t,o,e,r){this._api=t,this.methods=e,this.path=o,this.init()};t.prototype.init=function(){var n=this;this.methods.forEach(function(t){var o,e=c(o=t)&&o.method?o.method:o,r={http_method:"get",client_method:e};e.match(/update|addItem|addProduct/)&&(r.http_method="put"),e.match(/create/)&&(r.http_method="post"),e.match(/removeItem|removeProduct/)&&(r.http_method="delete"),e.match(/files|items|watching|watchlist/)&&(r.scope=t),e.match(/addItem|removeItem/)&&(r.scope="items"),n[e]=function(t,o){return r.url=a(t,n,r),c(t)?r.options=t:r.options=o,n.createRequestParams(r)}})},t.prototype.getParams=function(t,o,e,r,n){var i={timeout:this._api.timeout,method:t,url:o};return c(e)&&(i.qs=e||null),this._api.auth&&(i.headers={Accept:"application/json","Content-Type":"application/json",Authorization:this._api.auth}),this._api.internal&&(i.headers={Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+this._api.token}),i},t.prototype.createRequestParams=function(t){var o=this.getParams(t.client_method,t.url,t.options,t.scope,t.read_only);return this.fetchRequest(t,o)},t.prototype.fetchRequest=function(o,t){var e=new URL(t.url);return o.options&&Object.keys(o.options).forEach(function(t){o.options[t]&&e.searchParams.append(t,o.options[t])}),fetch(e.href,{method:o.http_method,headers:t.headers,credentials:"include"}).then(function(t){return t.ok?204===t.status?{}:t.json():Promise.reject({status:t.status,statusText:t.statusText})})};var o=function(o){function t(t){o.call(this,t,"collections",["all","retrieve","items","update","create","addItem","removeItem"])}return o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t}(t),l=function(o){function t(t){o.call(this,t,"videos",["all","retrieve","files","create","update"])}return o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t}(t),d=function(o){function t(t){o.call(this,t,"customers",["retrieve","all","watching","watchlist","addProduct","removeProduct","update"])}return o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t}(t),f=function(o){function t(t){o.call(this,t,"browse",["list"])}return o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t}(t),_={products:function(o){function t(t){o.call(this,t,"products",["retrieve","all"])}return o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t}(t),browse:f,videos:l,collections:o,customers:d,analytics:function(o){function t(t){o.call(this,t,"analytics",["retrieve"])}return o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t}(t)};"undefined"==typeof btoa&&(global.btoa=function(t){return new Buffer(t).toString("base64")});var m=function(t,o){void 0===o&&(o={}),this.api=o.internal?this.setToken(t,o):this.setApi(t,o),this.prepareResources()};return m.prototype.setApi=function(t,o){return void 0===o&&(o={}),{auth:"Basic "+btoa(t),host:o.host||e,protocol:o.protocol||r,timeout:n,token_expiration:null}},m.prototype.setToken=function(t,o){return void 0===o&&(o={}),{token:t,host:o.host||e,protocol:o.protocol||r,timeout:o.timeout||n,token_expiration:o.TOKEN_EXPIRES_IN||i,internal:!0}},m.prototype.prepareResources=function(){for(var t in _)this[t[0].toLowerCase()+t.substring(1)]=new _[t](this.api)},m});
//# sourceMappingURL=index.js.map
