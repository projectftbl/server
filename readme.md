## @ftbl/server

Server is a koa.js web server with sane defaults.

### Usage

```javascript
var Server = require('@ftbl/server');

var server = new Server();

// To configure routes and middleware
server.configure('/path/to/apps');

// To start
server.start();

// To stop
server.stop();
```

### Resources

Resource files are expected in a specific structure:

```
apps
  users
    resources
      routes.js
      users.js
      user.js
  groups
    resources
      routes.js
      groups.js
      group.js
```

This will mount routes at `/users` and `/groups`, if the `apps` folder is passed to `server.configure`. 

The `routes.js` file should export a single function, passed with these parameters:

```javascript
module.exports = function(router, resources, errors) {
  //
};
```

The `router` parameter is a `koa-router`, the `resources` is an array of all of the files in the directory, each of which should have route handlers.

For example, `users.js` should export a function which returns multiple handlers:

```javascript
module.exports = function(errors) {
  return {
    get: function *(next) { }
  , post: function *(next) { }
  }
};
```

And these would be routed in `routes.js` like this:

```javascript
module.exports = function(router, resources, errors) {
  var users = resources.users(errors);
  
  router.get('/', users.get);
  router.post('/', users.post);
};
