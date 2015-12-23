var express = require('express');
var db = require('./fakedata.json');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors')
var Tabletop = require('tabletop')

var logger = require('morgan')
var app = express();
var accessLogStream =
  fs.createWriteStream(__dirname + '/access.log', {flags: 'a', verbose: true})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.use('/catalog', function (req, res, next) {
  var public_spreadsheet_url =
    'https://docs.google.com/spreadsheets/d/1xMW98m2-Y8rrbmACA9l1fUT5jb4tKvrRBCSWvH28guw/pubhtml?gid=1526253182&single=true'
  Tabletop.init({ key: public_spreadsheet_url,
                  callback: showInfo,
                  simpleSheet: true,
                  debug: false
  })
  function showInfo(data, tabletop) {
    // Save the data to a flat file on the local server
    fs.writeFile('./catalog.json', JSON.stringify(data), function(err) {
      if (err) throw err;
      else console.log('Successfully wrote google sheet data to catalog.json.')
    }) // fs.writeFile
    // Append the google sheet data to the response.
    // This is then passed to the routes, where it can be served to the user.
    res.tabledata = data
    next()
  } // showInfo declaration
}) // app.use

app.get('/', function(req, res) {
  res.send('Hello World');
});

// list catalog
app.get('/catalog', function(req, res) {
  console.log('Getting the catalog')
  // console.log('Heres your request', req)

  res.json(res.tabledata);
})

app.post('/orders', function(request, response) {
  console.log(request)
  response.send('got it')
})

// app.get('/catalog/:id', function(req, res) {
//   var id = Number(req.params.id);
//   for (var i = 0; i < db.catalog.length; i++) {
//     if (db.catalog[i].id === id) {
//       var item = db.catalog[i], i = db.catalog.length;
//     }
//   }
//   if (item) res.json(item);
//   else  res.sendStatus(404);
// });

// app.post('/catalog/new', function(req, res) {
//   var newid = db.catalog[db.catalog.length - 1].id + 1;
//   if (req.body.name && req.body.description) {
//     db.catalog.push({
//       id: newid,
//       name: req.body.name,
//       price: req.body.price,
//       description: req.body.description });
//     fs.writeFile('./fakedata.json', JSON.stringify(db), function(err) {
//       if (err) throw err;
//       else {
//         console.log('success')
//         res.send(true);
//       }
//     });
//   } else {
//     res.send(false);
//   }
// });

// app.delete('/catalog/:id', function(req, res) {
//   var id = Number(req.params.id);
//   var found = false;
//   for (var i = 0; i < db.catalog.length; i++) {
//     if (db.catalog[i].id === id) {
//       found = true;
//       db.catalog.splice(i, 1);
//       fs.writeFile('./fakedata.json', JSON.stringify(db), function(err) {
//         if (err) {
//           res.send(false);
//         }
//         else res.send(true);
//       });
//       i = db.catalog.length;
//     }
//   }
//   if (!found) res.send(false);
// });

app.listen(process.env.PORT || 8080);
console.log('Server running on port ', process.env.PORT || 8080);
