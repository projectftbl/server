module.exports = function() {
  return function *(next) {
    this.status = 404;
    this.body = { message: 'Not found' };
  };
};