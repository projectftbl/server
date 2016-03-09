var errors = require('@ftbl/errors')
  , Authorizer = require('@ftbl/authorize')
  , rights = Authorizer.rights;

module.exports = function() {
  return function *(next) {
    var session = this.session;

    if (session == null) throw new errors.NotAuthorizedError();

    var right = function(permission) {
      if (permission.length > 1) return rights[permission[1]];
      
      return {
        POST   : rights.Create
      , GET    : rights.Read
      , PUT    : rights.Update
      , PATCH  : rights.Update
      , DELETE : rights.Delete
      }[this.request.method];
    };

    var thing = permission[0]
      , authorized = new Authorizer(Authorizer.fromRoles(session.roles)).can(thing, right(permission));

    if (authorized === false) new errors.NotAuthorizedError();

    yield next;
  };
};
