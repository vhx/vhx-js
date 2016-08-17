'use strict';

class Paginate {
  constructor(resource, args) {
    let _this = this;

    _this.resource = resource;
    _this.response = args.body;
    _this.options  = args.options;
    _this.page     = _this.options.page ? _this.options.page : 1;
    _this.method   = args.method;
    _this.last     = Math.ceil(args.body.total / (args.body.count * _this.page));

    ['nextPage','previousPage','firstPage','lastPage'].map(function(key) {
      _this.response[key] = function(callback) {
        _this[key](_this, callback);
      };
    });

    _this.response.goToPage = function(num, callback) {
      _this.goToPage(_this, num, callback);
    };

    _this.response.merge = function(_this) {
      _this._embedded[_this.object] = this._embedded[_this.object].concat(_this._embedded[_this.object]);
      _this.count = this.count + _this.count;

      return _this;
    };
  }

  get() {
    let _this = this;

    return _this.response;
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

module.exports = Paginate;