var express = require('express');
var app = express();

app.listen(8080);
console.log('Server running on port 8080');

app.get('/', function(req, res) {
  res.send('Hello World');
});
