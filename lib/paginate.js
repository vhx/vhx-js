'use strict';

class Paginate {
  constructor(resource, args) {
    this.resource = resource;
    this.response = args.body;
    this.options  = args.options;
    this.page     = this.options.page ? this.options.page : 1;
    this.method   = args.method;
    this.last     = Math.ceil(args.body.total / (args.body.count * this.page));

    ['nextPage','previousPage','firstPage','lastPage'].map(function(key) {
      this.response[key] = function(callback) {
        this[key](this, callback);
      };
    });

    this.response.goToPage = function(num, callback) {
      this.goToPage(this, num, callback);
    };

    this.response.merge = function(this) {
      this._embedded[this.object] = this._embedded[this.object].concat(this._embedded[this.object]);
      this.count = this.count + this.count;

      return this;
    };
  }

  get() {
    return this.response;
  }

  nextPage(_this, callback) {
    _this.options.page = _this.page + 1;

    if (_this.options.page > _this.last) {
      throw 'No more pages to request';
    }

    _this.resource[_this.method](_this.options, callback);
  }

  previousPage(_this, callback) {
    if (_this.page === 1) {
      throw 'No previous pages to request';
    }

    _this.options.page = _this.page - 1;
    _this.resource[_this.method](_this.options, callback);
  }

  firstPage(_this, callback) {
    _this.options.page = 1;
    _this.resource[_this.method](_this.options, callback);
  }

  lastPage(_this, callback) {
    _this.options.page = _this.last;
    _this.resource[_this.method](_this.options, callback);
  }

  goToPage(_this, num, callback) {
    num = parseInt(num, 10);

    if (num > 0 && num <= _this.last) {
      _this.options.page = num;
      return _this.resource[_this.method](_this.options, callback);
    }

    throw 'You must pass a valid page number';
  }
}

export default Paginate;