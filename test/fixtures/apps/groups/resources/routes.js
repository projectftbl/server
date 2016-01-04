module.exports = function(router, resource, middleware, errors) {
  var groups = resource.groups(middleware, errors);
  
  router.get('/', groups.get);
  router.post('/', groups.post);
};
