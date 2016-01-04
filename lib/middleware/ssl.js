var configuration = require('@ftbl/configuration');

module.exports = function() {
  return function *(next) {
    var protocol = this.request.headers['x-forwarded-proto']; 

    if (configuration('node:env') !== 'production' || !configuration('http:secure') || protocol === 'https') {
      return yield next;
    }
      
    this.response.redirect('https://' + this.request.headers.host + this.request.url);
  };
};
