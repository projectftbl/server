var configuration = require('@ftbl/configuration');

module.exports = function() {
  var noSSL = !configuration('http:secure');

  return function *(next) {
    if (noSSL || this.request.secure) return yield next;

    this.response.redirect('https://' + this.request.headers.host + this.request.url);
  };
};
