var _ = require('lodash')
  , fs = require('fs')
  , path = require('path')

module.exports = function(middleware, folder) {
  var customMiddleware = {}
    , directory = path.join(folder, '../middleware')
    , files;

  try {
    files = fs.readdirSync(directory);
  } catch(e) {}

  _.forEach(files, function(file) {
    var filename = path.join(directory, file)
      , base = path.basename(filename, path.extname(filename))
      , fn = require(filename);
    
    if (middleware.hasOwnProperty(base)) {
      middleware[base] = fn;
    } else {
      customMiddleware[base] = fn;
    }
  });

  return customMiddleware;
};
