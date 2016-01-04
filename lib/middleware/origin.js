module.exports = function() {
  return function *(next) {
    var headers = this.request.headers
      , host = headers.host
      , origin = headers['x-original-host'] || headers.origin;

    this.origin = origin || host;
    this.host = host;

    yield next;
  };
};