var chalk = require('chalk')
  , Router = require('koa-router')
  , path = require('path')
  , requireDir = require('require-dir')
  , log = require('@ftbl/log')
  , utility = require('@ftbl/utility');

module.exports = function(server, root, middleware, errors) {
   
  var mounted = utility.folders(root).map(function(name) {
    var folder = path.join(root, name, 'resources')
      , route = require(folder + '/routes')
      , resources = requireDir(folder);

    var router = new Router({ prefix: '/' + name });
  
    route(router, resources, middleware, errors);
  
    server.app.use(router.routes());
    server.app.use(router.allowedMethods());

    return chalk.cyan(name);
  });     

  log.info(chalk.green(server.name) + ': mounting routes ' + mounted.join(', '));
};