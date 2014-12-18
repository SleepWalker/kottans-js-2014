var fs = require('fs');

var path = process.argv[2];

var buffer = fs.readFileSync(path);

console.log(buffer.toString().split('\n').length - 1);
