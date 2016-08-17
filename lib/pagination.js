'use strict';

class Pagination {
  constructor(response) {
    let _this = this;

    response.nextPage     = _this.nextPage;
    response.previousPage = _this.previousPage;
    response.firstPage    = _this.firstPage;
    response.lastPage     = _this.lastPage;
    response.goToPage     = _this.goToPage;
    response.merge        = _this.merge;

    return response;
  }

  nextPage(callback) {
    console.log('next');
  }

  previousPage(callback) {
    console.log('previous');
  }

  firstPage(callback) {
    console.log('first');
  }

  lastPage(callback) {
    console.log('last');
  }

  goToPage(num, callback) {
    console.log('goto');
  }

  merge(callback) {
    console.log('merge');
  }
}

module.exports = Pagination;