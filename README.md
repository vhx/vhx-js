# Vimeo OTT/VHX Javascript API Client

Ready for use server-side, using Node. 
Not ready for use client-side, as we currently do not offer public API keys.

### Installation

`npm install @vhx/vhxjs`

### Documentation

For Full API reference [go here](http://dev.vhx.tv/docs/api?javascript).

### Getting Started

Before requesting your first resource, you must setup your instance of the Vimeo OTT/VHX Client. This can be done with either:

Node:
```js
const VhxApi = require('@vhx/vhxjs/dist/index.js');

const vhx = new VhxApi('YOUR_API_KEY_HERE');
```

Client (using a module bundler like Webpack/Rollup/etc.)
```js
import VhxApi from '@vhx/vhxjs';

const vhx = new VhxApi('YOUR_API_KEY_HERE');
```

or through a standard script tag, (use client.js in the dist folder)
```js
<script src="your_path/client.js"></script>
var vhx = new VhxApi('YOUR_API_KEY_HERE');
```

Depending on the endpoint, the resource will take either:
- two arguments - an id, then an optional object with options
- one argument - only an options object

The id can either be in the form of a numeric ID or an HREF (see example below).

This library uses Promises instead of callbacks. You can either use `then/catch` or `async/await`:

```js
vhx.customers.retrieve('1234').then(res => console.log(res));
```
or
```js
async getCustomers() => {
  const customers = await vhx.customers.retrieve('https://api.vhx.tv/customers/1234');
  console.log(customers);  // logs the object once the promise is resolved
}
```

### Resources & Methods

products
  * [`retrieve`](http://dev.vhx.tv/docs/api/?javascript#product-retrieve)
  * [`all`](http://dev.vhx.tv/docs/api/?javascript#product-list)

customers
  * [`retrieve`](http://dev.vhx.tv/docs/api/?javascript#customer-retrieve)
  * [`all`](http://dev.vhx.tv/docs/api/?javascript#customer-list)
  * [`watching`](http://dev.vhx.tv/docs/api/#customer-watching)
  * [`watchlist`](http://dev.vhx.tv/docs/api/#customer-retrieve-watchlist)

videos
  * [`retrieve`](http://dev.vhx.tv/docs/api?javascript#videos-get)
  * [`all`](http://dev.vhx.tv/docs/api?javascript#videos-list)
  * [`files`](http://dev.vhx.tv/docs/api/?javascript#videos-list-files)

collections
  * [`retrieve`](http://dev.vhx.tv/docs/api?javascript#collections-retrieve)
  * [`all`](http://dev.vhx.tv/docs/api?javascript#collections-list)
  * [`items`](http://dev.vhx.tv/docs/api?javascript#collection-items-list)

browse
  * [`all`](http://dev.vhx.tv/docs/api/#browse-all)

analytics
  * [`retrieve`](http://dev.vhx.tv/docs/api/#analytics-by-video)
