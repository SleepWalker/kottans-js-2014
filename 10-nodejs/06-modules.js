var listByExt = require('./06-modules-listByExt.js');
var dir = process.argv[2];
var ext = process.argv[3];


listByExt(dir, ext, function(err, data) {
  console.log(data.join('\n'));
});
