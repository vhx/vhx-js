# VHX Javascript API Client

API applications can be created in the [VHX admin](https://www.vhx.tv/admin/platforms) or by emailing [api@vhx.tv](mailto:api@vhx.tv)

### Installation

`npm install vhxjs`

### Documentation

Documentation, including a step-by-step tutorial is available on the [VHX Developer Docs ](http://dev.vhx.tv/api?javascript) site.
For Full API reference [go here](http://dev.vhx.tv/docs/api?javascript).

### Getting Started

Before requesting your first resource, you must setup your instance of the VHX Client:

```js
var vhxjs = new vhx('your Public VHX API key');
```

Every resource method has two arguments. The first argument is an options object or identifier and the second, an optional callback:

```js

// example customer create
vhxjs.customers.list({
  email: 'customer@email.com',
  name: 'First Last'
}, function(err, customer){
  // err, = error is false if no error occurred
  // customer = the created customer object
});
```

### Resources & methods

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
Paginated resource responses will have helper methods attached for conveniently requesting the next, previous, first, last, and specific pages.

```javascript
var collectionList;

vhxjs.collections.all({
  per_page: 25
}, function(err, collection) {
  collectionList = collection;
})

$('.next-page').on('click', function() {
  collectionList.nextPage(function(err, collection) {
    // if you the items and count to be concatenated use the merge method would not use the merge method
    collectionList.merge(page);

    // if you just want the one page
    collectionList = page;
  });
})
````

nextPage(callback:Function)
previousPage(callback:Function)
firstPage(callback:Function)
lastPage(callback:Function)
goToPage(page:Integer, callback:Function)
merge(collection:Object)
