var fs = require('fs');

module.exports = function(dir, ext, callback) {
  var re = new RegExp('.'+ext+'$');

  fs.readdir(dir, function(err, list) {
    callback(err, err || list.filter(filterRe(re)));
  });
};

function filterRe(re) {
  return function(str) {
    return re.test(str);
  };
}

