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

collect(process.argv[2], function(data) {
  console.log(data.length);
  console.log(data);
});
