var jwt = require('jsonwebtoken')
  , errors = require('@ftbl/errors')
  , configuration = require('@ftbl/configuration');

var secret = configuration('token:secret');

module.exports = function() {
  return function *(next) {
    var headers = this.request.headers
      , token = headers['x-session-token'];

    if (token == null) {
      if (this.session.id == null) {
        this.session = { id: headers['x-original-session'] };
      }
    } else {
      try {
        var session = jwt.verify(token, secret);

        this.session = session;
        this.token = token;
      } catch(err) {
        throw new errors.NotAuthorizedError();
      }
    }

    yield next;
  };
};