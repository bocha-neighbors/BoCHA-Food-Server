var express = require('express');
var db = require('./fakedata.json');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors')

var app = express();

app.listen(8080);
console.log('Server running on port 8080');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


app.get('/', function(req, res) {
  res.send('Hello World');
});

// list catalog
app.get('/catalog', function(req, res) {
  res.json(db.catalog);
});

app.get('/catalog/:id', function(req, res) {
  var id = Number(req.params.id);
  for (var i = 0; i < db.catalog.length; i++) {
    if (db.catalog[i].id === id) {
      var item = db.catalog[i], i = db.catalog.length;
    }
  }
  if (item) res.json(item);
  else  res.sendStatus(404);
});

app.post('/catalog/new', function(req, res) {
  var newid = db.catalog[db.catalog.length - 1].id + 1;
  if (req.body.name && req.body.description) {
    db.catalog.push({ id: newid, name: req.body.name, description: req.body.description });
    fs.writeFile('./fakedata.json', JSON.stringify(db), function(err) {
      if (err) throw err;
      else res.send(true);
    });
  } else {
    res.send(false);
  }
});

app.delete('/catalog/:id', function(req, res) {
  var id = Number(req.params.id);
  var found = false;
  for (var i = 0; i < db.catalog.length; i++) {
    if (db.catalog[i].id === id) {
      found = true;
      db.catalog.splice(i, 1);
      fs.writeFile('./fakedata.json', JSON.stringify(db), function(err) {
        if (err) {
          res.send(false);
        }
        else res.send(true);
      });
      i = db.catalog.length;
    }
  }
  if (!found) res.send(false);
});
