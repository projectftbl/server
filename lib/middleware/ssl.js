var log = require('@recipher/log')
  , configuration = require('@recipher/configuration');

module.exports = function() {
  var noSSL = !configuration('http:secure');

  return function *(next) {
    var protocol = this.request.headers['x-forwarded-proto']
      , isAzure = this.request.headers['x-site-deployment-id']
      , isSSL = this.request.headers['x-arr-ssl'];

    if (noSSL || protocol === 'https' || this.request.secure || (isAzure && isSSL)) return yield next;
      
    this.response.redirect('https://' + this.request.headers.host + this.request.url);
  };
};
