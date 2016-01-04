var log = require('@ftbl/log');

module.exports = function() {
  return function *(next) {
    try {
      yield next;
    } catch (err) {
      if (401 === err.status) this.set('WWW-Authenticate', 'Basic');

      this.status = err.status || 500;
      this.body = { message: err.message, status: this.status };

      this.app.emit('error', err, this);
    }
  }
};