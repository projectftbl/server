var log = require('@recipher/log')
  , configuration = require('@recipher/configuration');

module.exports = function() {
  return function *(next) {
    try {
      yield next;
    } catch (err) {
      if (401 === err.status) this.set('WWW-Authenticate', 'Basic');

      this.status = err.status || 500;
      this.body = { message: err.message, status: this.status };

      if (configuration('node:env') === 'development') this.body.error = err;

      err.url = this.request.url;

      this.app.emit('error', err, this);
    }
  }
};