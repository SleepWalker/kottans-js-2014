var net = require('net');

var port = process.argv[2];

var server = net.createServer(function (socket) {
  var date = formatDate(new Date());
  socket.end(date+'\n');
});

server.listen(port);

function formatDate(date) {
  return [
    date.getFullYear(),
    '-',
    zeroPadding(date.getMonth() + 1),
    '-',
    zeroPadding(date.getDate()),
    ' ',
    zeroPadding(date.getHours()),
    ':',
    zeroPadding(date.getMinutes())
    ].join('');
}

function zeroPadding(val) {
  return (val/100).toFixed(2).slice(2);
}
