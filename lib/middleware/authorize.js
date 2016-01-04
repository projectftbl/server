module.exports = function() {
  return function *(next) {
    yield next;
  };
};