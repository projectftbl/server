module.exports = function() {
  return function *(next) {
    var headers = this.request.headers;

    if (this.session.id == null) {
      this.session = { id: headers['x-original-session'] };
    }

    yield next;
  };
};