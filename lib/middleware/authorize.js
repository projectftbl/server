var _ = require('lodash')
  , errors = require('@recipher/errors')
  , Authorizer = require('@recipher/authorize')
  , rights = Authorizer.rights;

var titleize = function(str) {
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
    return c.toUpperCase();
  });
};

module.exports = function() {
  var claims = [].slice.call(arguments);

  return function *(next) {
    var request = this.request
      , query = this.query
      , params = this.params
      , user = (this.session.id && this.session) || this.user; // Use logged in user or fallback to system user

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

    var entity = function(claim) {
      if (claim[0].indexOf(':') === 0) {
        var key = claim[0].split(':')[1];

        return (params && params[key]) || (query && query[key]);
      };

      return claim[0];
    };

    var authorize = function(memo, claim) {
      if (_(claim).isArray() === false) claim = claim.split(' ').reverse();

      return memo || new Authorizer(Authorizer.fromUser(user)).can(entity(claim), right(claim));
    };

    var authorized = _(claims).reduce(authorize, false);

    if (authorized === false) throw new errors.NotAuthorizedError();

    yield next;
  };
};
