var http = require('http');
var url = require('url');

var port = process.argv[2];

var server = http.createServer(function(req, res) {
   var info = url.parse(req.url, true);
   var output = {};

   if (info.query.iso) {
     var date = new Date(info.query.iso);
   } else {
     return error(res);
   }

   switch (info.pathname) {
     case '/api/parsetime':
         output = splitDate(date);
       break;
     case '/api/unixtime':
       output = toUnixTime(date);
       break;
     default:
       return error(res);
       break;
   }

   res.writeHead(200, {'Content-Type': 'application/json'});
   res.end(JSON.stringify(output));
});

server.listen(port);

function splitDate(date) {
  return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
  };
}

function toUnixTime(date) {
  return {unixtime: date.getTime()};
}

function error(res) {
   res.writeHead(404);
   res.end();
}
