var http = require('http');

var port = process.argv[2];


var server = http.createServer(function(req, res) {
  if (req.method != 'POST') {
    res.end();
    return;
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});

  req.setEncoding('utf8');
  req.on('data', function(data) {
    res.write(data.toUpperCase());
  });

  req.on('end', res.end.bind(res));
});

server.listen(port);
