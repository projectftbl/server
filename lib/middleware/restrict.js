module.exports = function() {
  return function *(next) {
    if (this.session == null) throw new errors.NotAuthorizedError();

    yield next;
  };
};