var _ = require('lodash')
  , authenticate = require('basic-auth')
  , configuration = require('@ftbl/configuration');

module.exports = function() {
  var users = configuration('http:authenticate');

  return function *(next) {       
    if (users == null) return yield next;

    if (_(users).isArray() === false) users = [ users ];

    var authenticated = authenticate(this);

    if (authenticated == null) return this.throw(401);

    var mapToUser = function(user) {
      var parts = user.split('/');
      return { name: parts[0], pass: parts[1] };
    };

    var findByNameAndPassword = function(user) {
      return authenticated.name === user.name && authenticated.pass === user.pass;
    };

    var user = _.chain(users).map(mapToUser).find(findByNameAndPassword).value();

    if (user == null) return this.throw(401);

    this.user = user;

    yield next;
  };
};
