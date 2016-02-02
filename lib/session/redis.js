var Store = require('koa-redis')
  , redis = require('@ftbl/redis');

module.exports = new Store({ client: redis.connection });