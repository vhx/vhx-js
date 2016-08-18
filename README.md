# VHX Javascript API Client

Currently not ready for production use, but in Pre-Release. Publishable VHX API keys with limited scope will be required for use.

### Installation

`npm install vhxjs@beta`

### Documentation

For Full API reference [go here](http://dev.vhx.tv/docs/api?javascript).

### Getting Started

Before requesting your first resource, you must setup your instance of the VHX Client:

```js
var vhxjs = new vhx('your Public VHX API key');
```

Every resource method has two arguments. The first argument is an options object or identifier and the second, an optional callback:

```js

// example collections request
vhxjs.collections.all({
 product: 'https://api.vhx.tv/products/1'
}, function(err, collections){
  // err, = error is false if no error occurred
  // collections = the response object
});
```

### Resources Methods

products
  * [`retrieve`](http://dev.vhx.tv/docs/api/?javascript#product-retrieve)
  * [`all`](http://dev.vhx.tv/docs/api/?javascript#product-list)

customers
  * [`retrieve`](http://dev.vhx.tv/docs/api/?javascript#customer-retrieve)
  * [`all`](http://dev.vhx.tv/docs/api/?javascript#customer-list)

videos
  * [`retrieve`](http://dev.vhx.tv/docs/api?javascript#videos-get)
  * [`all`](http://dev.vhx.tv/docs/api?javascript#videos-list)
  * [`files`](http://dev.vhx.tv/docs/api/?javascript#videos-list-files)

collections
  * [`retrieve`](http://dev.vhx.tv/docs/api?javascript#collections-retrieve)
  * [`all`](http://dev.vhx.tv/docs/api?javascript#collections-list)
  * [`items`](http://dev.vhx.tv/docs/api?javascript#collection-items-list)


### Pagination Methods
Paginated resources will have helper methods available in the response object for conveniently requesting the next, previous, first, last, and specific pages.

```javascript
var collectionList;

vhxjs.collections.all({
  per_page: 25
}, function(err, collections) {
  collectionList = collections;
})

// example next page request with jquery
$('.next-page').on('click', function() {
  collectionList.nextPage(function(err, collections) {
    // if you want the items and count to be concatenated
    collectionList.merge(collections);

    // if you just want the one page
    collectionList = collections;
  });
})
```

* `nextPage(callback:Function)`<br>
Gets the next page in the request. If you are on the last page the *No more pages to request* error will be thrown.

* `previousPage(callback:Function)`<br>
Gets the previous page in the request. If you are on the first page the *No previous pages to request* error will be thrown.

* `firstPage(callback:Function)`<br>
Gets the first page in the request.

* `lastPage(callback:Function)`<br>
Gets the last page in the request.

* `goToPage(page:Integer, callback:Function)`<br>
Gets the specified page in the request. If a non-integer or page greater than pages available is requested the *You must pass a valid page number* error will be thrown.

* `merge(response:Object)`<br>
Merges a page with previously requested page. It is recommended to use this when using the `nextPage` method in a "Load More" scenario where you are appending items to a growing cascade.
