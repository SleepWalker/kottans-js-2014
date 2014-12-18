var http = require('http');

function collect(url, callback) {
  var str = '';
  http.get(url, function(resp) {
    resp.setEncoding('utf8');

    resp.on('data', function(chunk) {
      str += chunk;
    });

    resp.on('end', function() {
      callback(str);
    });
  });
}

var urls = process.argv.slice(2);
var resps = [];
var processed = 0;

urls.map(function(item, index) {
  collect(item, function(data) {
    resps[index] = data;
    processed++;

    if (processed == urls.length) {
      console.log(resps.join('\n'));
    }
  });
});


