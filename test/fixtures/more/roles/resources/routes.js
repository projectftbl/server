module.exports = function(router, resource, middleware, errors) {
  var roles = resource.roles(middleware, errors);
  
  router.get('/', roles.get);
};
