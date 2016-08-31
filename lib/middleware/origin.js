var log = require('@ftbl/log');

module.exports = function() {
  return function *(next) {
    var headers = this.request.headers
      , host = headers.host
      , origin = headers['x-original-host'] || headers.origin;

    log.warn('headers', headers);
    log.warn('host', host);
    log.warn('origin', origin);

    this.origin = origin || host;
    this.host = host;

    yield next;
  };
};