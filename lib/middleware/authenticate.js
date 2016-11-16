var _ = require('lodash')
  , authenticate = require('basic-auth')
  , configuration = require('@recipher/configuration');

var users = configuration('http:authenticate')
  , roles = configuration('roles');

var mapToUser = function(user) {
  if (user == null) return;

  if (_.isObject(user) === false) {
    var props = user.split('/');
    user = { name: props[0], pass: props[1], roles: props[2] && props[2].split(',') };
  }

  // Populate roles
  user.roles = user.roles.map(function(role) {
    return _.find(roles, { handle: role });
  });

  return user;
};

module.exports = function() {  
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
