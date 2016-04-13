var configuration = require('@ftbl/configuration');

module.exports = function() {
  var noSSL = !configuration('http:secure');

  return function *(next) {
    var protocol = this.request.headers['x-forwarded-proto']; 

    if (noSSL || protocol === 'https' || this.request.secure) return yield next;
      
    this.response.redirect('https://' + this.request.headers.host + this.request.url);
  };
};
