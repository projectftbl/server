module.exports = function(router, resource, middleware, errors) {
  var users = resource.users(middleware, errors);
  
  router.get('/', users.get);
};
