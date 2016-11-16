var Store = require('koa-redis')
  , redis = require('@recipher/redis');

module.exports = new Store({ client: redis.connection });