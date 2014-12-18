var fs = require('fs');

var path = process.argv[2];

fs.readFile(path, 'utf-8', function(err, str) {
  console.log(str.split('\n').length - 1);
});

