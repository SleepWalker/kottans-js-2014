var express = require('express'),
    app = express(),
    port = 8080;

app.get('*', function(req, res) {
    res.end('Hello World!');
});

app.listen(port);

console.log('Server is up on port %s.', port);
