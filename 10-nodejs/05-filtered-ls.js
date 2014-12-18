var fs = require('fs');

var dir = process.argv[2];
var ext = process.argv[3];
var re = new RegExp('.'+ext+'$');

fs.readdir(dir, function(err, list) {
  console.log(list.filter(filterRe(re)).join('\n'));
});

function filterRe(re) {
  return function(str) {
    return re.test(str);
  };
}
