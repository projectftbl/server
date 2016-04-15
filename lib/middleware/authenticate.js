var _ = require('lodash')
  , authenticate = require('basic-auth')
  , configuration = require('@ftbl/configuration');

var mapToUser = function(user) {
  if (_.isObject(user) || user == null) return user;

  var parts = user.split('/');
  return { name: parts[0], pass: parts[1] };
};

module.exports = function() {
  var users = configuration('http:authenticate');
  
  if (_(users).isArray() === false) users = [ users ];

  users = _.chain(users).map(mapToUser).compact().value();

  return function *(next) {       
    if (users.length === 0) return yield next;

    var authenticated = authenticate(this);

    if (authenticated == null) return this.throw(401);

    var findByNameAndPassword = function(user) {
      return authenticated.name === user.name && authenticated.pass === user.pass;
    };

    var user = _(users).find(findByNameAndPassword);

    if (user == null) return this.throw(401);

    this.user = user;

    yield next;
  };
};
