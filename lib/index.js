var _ = require('lodash')
  , Koa = require('koa')
  , http = require('http')
  , https = require('https')
  , chalk = require('chalk')
  , compress = require('koa-compress')
  , morgan = require('koa-morgan')
  , session = require('koa-generic-session')
  , methodOverride = require('koa-methodoverride')
  , qs = require('koa-qs')
  , cors = require('koa-cors')
  , ratelimit = require('koa-ratelimit')
  , middleware = require('require-dir')('./middleware')
  , processCustomMiddleware = require('./middleware')
  , log = require('@ftbl/log')
  , configuration = require('@ftbl/configuration')
  , redis = require('@ftbl/redis')
  , errors = require('@ftbl/errors')
  , mount = require('./mount');
 
var WebServer = function(name, folder) {
  if (this instanceof WebServer === false) return new WebServer(name, folder);

  this.name = name;
  this.folder = folder;

  this.app = new Koa();
  this.port = process.env.PORT || 3000;
  
  this.middleware = processCustomMiddleware(middleware, folder);

  this.environment = process.env.NODE_ENV || 'development';

  qs(this.app, 'extended');
};

var noOp = function() {
  // Nothing
};

var logger = function() {
  var format = configuration('logging:format') || 'dev';

  return morgan.middleware(format, { 
    skip: function(req, res) { return res.statusCode === 304; }
  , stream: {
      write: function(message) {
        log.info(message);
      }
    }
  });
};

WebServer.prototype.configure = function(folder) {
  this.app.use(logger());

  this.app.proxy = true;

  this.app.use(middleware.ssl());
  this.app.use(middleware.error());
  this.app.use(middleware.body());
  this.app.use(methodOverride());
  this.app.use(compress());
  this.app.use(ratelimit({ db: redis.connection, duration: 60000, max: 100, throw: true }));

  this.app.use(cors(configuration('http:cors')));

  this.app.keys = [ 'defacto', 'kohl', this.name ];
  this.app.use(session({ store: require('./session/' + (configuration('session') || 'redis')), rolling: true, cookie: { signed: false }}));

  this.app.use(middleware.session());
  this.app.use(middleware.origin());
  this.app.use(middleware.authenticate());
  this.app.use(middleware.context());
  
  _.forOwn(this.middleware, function(fn) {
    this.app.use(fn());
  }, this);

  this.mount(this.folder); 
  
  return this;
};

WebServer.prototype.mount = function(folder) {
  mount(this, folder, middleware, errors); 

  return this;
};

WebServer.prototype.prepare = function() {
  this.app.use(middleware.catchall());

  this.app.on('error', function(err) {
    log.error(configuration('logging:stack') ? err : err.message);
  }.bind(this));

  return this;
};

WebServer.prototype.start = function(callback) {
  log.info(chalk.green(this.name) + ': starting ' + chalk.green(this.environment) + ' server at port ' + chalk.green(this.port));

  this.server = http.createServer(this.app.callback());
  this.server.listen(this.port, callback || noOp);

  return this;
};

WebServer.prototype.stop = function(callback) {
  this.server.close(callback || noOp);
  
  return this;
};

module.exports = WebServer;