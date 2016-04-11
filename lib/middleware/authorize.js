var _ = require('lodash')
  , errors = require('@ftbl/errors')
  , Authorizer = require('@ftbl/authorize')
  , rights = Authorizer.rights;

var titleize = function(str) {
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
    return c.toUpperCase();
  });
};

module.exports = function(claim) {
  if (_(claim).isArray() === false) claim = claim.split(' ');

  return function *(next) {
    var session = this.session
      , request = this.request;

    if (session == null) throw new errors.NotAuthorizedError();

    var right = function(claim) {
      if (claim.length > 1) return rights[titleize(claim[1])];
      
      return {
        POST   : rights.Create
      , GET    : rights.Read
      , PUT    : rights.Update
      , PATCH  : rights.Update
      , DELETE : rights.Delete
      }[request.method];
    };

    var authorized = new Authorizer(Authorizer.fromUser(session)).can(claim[0], right(claim));

    if (authorized === false) throw new errors.NotAuthorizedError();

    yield next;
  };
};
