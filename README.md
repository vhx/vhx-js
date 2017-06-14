# VHX Javascript API Client

Currently not ready for production use, but in Pre-Release. Publishable VHX API keys with limited scope will be required for use.

### Installation

`npm install vhxjs`

### Documentation

For Full API reference [go here](http://dev.vhx.tv/docs/api?javascript).

### Getting Started

Before requesting your first resource, you must setup your instance of the VHX Client. This can be done with either:

```js
import VhxApi from 'vhxjs'; // or const VhxApi = require('vhxjs');

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

This library uses Promises instead of callbacks. You can either use `then/catch` or `async/await` as so:

```js
vhx.customers.retrieve('1234').then(function(res) {
  console.log(res)
});
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