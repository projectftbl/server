var log = require('@ftbl/log');
var raw = require('raw-body');

var parseRaw = function(req, opts) {
  req = req.req || req;
  opts = opts || {};

  var len = req.headers['content-length'];

  if (len) opts.length = len = ~~len;

  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '1mb';

  var strict = opts.strict !== false;

  var parse = function(text) {
    log.info(text);

    if (!strict) return text ? JSON.parse(text) : text;

    if (!text) return {};

    if (!/^[\x20\x09\x0a\x0d]*(\[|\{)/.test(text)) {
      throw new Error('invalid JSON, only supports object and array');
    }
    return JSON.parse(text);
  };

  return raw(req, opts).then(function(body) {
    try {
      return { raw: body, json: parse(body) };
    } catch (err) {
      err.status = 400;
      err.body = body;
      throw err;
    }
  });
};

module.exports = function(opts) {
  var opts = opts || {}
    , empty = opts.empty === undefined || opts.empty;

  return function *(next) {
    var encoding = 'transfer-encoding' in this.req.headers;

    if ((encoding || this.request.length) && !this.req._readableState.ended) {
      try {
        var body = yield parseRaw(this, opts);

        this.request.body = body.json;
        this.request.rawBody = body.raw;

      } catch (err) {
        if (err.status !== 415 || !empty) throw err;
      }
    }

    yield next;
  }
};
