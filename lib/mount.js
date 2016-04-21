var chalk = require('chalk')
  , Router = require('koa-router')
  , path = require('path')
  , requireDir = require('require-dir')
  , log = require('@ftbl/log')
  , utility = require('@ftbl/utility')
  , configuration = require('@ftbl/configuration');

var ping = function *(next) {
  this.status = 200;
  this.body = this.request.body;
};

module.exports = function(server, root, middleware, errors) {
  
  var mounted = utility.folders(root).map(function(name) {
    var route = require(path.join(root, name, 'routes'))
      , resources = requireDir(path.join(root, name, configuration('resources') || 'resources'));

    var router = new Router({ prefix: '/' + name }); // TODO add app name (not server name)
  
    route(router, resources, middleware, errors);
  
    router.post('/ping', ping);

    server.app.use(router.routes());
    server.app.use(router.allowedMethods());

    return chalk.cyan(name);
  });     

  log.info(chalk.green(server.name) + ': mounting routes ' + mounted.join(', '));
};