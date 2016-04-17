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
  if (_(claim).isArray() === false) claim = claim.split(' ').reverse();

  return function *(next) {
    var request = this.request;

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

    var user = (this.session.id && this.session) || this.user // Use logged in user or fallback to system user
      , authorized = new Authorizer(Authorizer.fromUser(user)).can(claim[0], right(claim));

    if (authorized === false) throw new errors.NotAuthorizedError();

    yield next;
  };
};
