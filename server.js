/* Requirements */
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var sqlite3 = require('sqlite3');

/* Init a new app */
var app = express();
var router = express.Router();

/* Defaults */
var config = {
  port: 3000,
  dbFile: './store.db'
};

/* Connect to db */
var db = new sqlite3.Database(config.dbFile);

/* bodyParser is so we can read POSTed json data */
app.use(bodyParser.json());
app.use(router);

/* Remove this vile code when we're deployed */
router.all('/', function(req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

/**
 * Suffice client with the current legend and the previous one
 */
router.get('/', function (req, res) {
  db.get(''+
  'SELECT current, previous, since FROM legend WHERE id = (SELECT MAX(id) FROM legend)' +
  '', function(err, row) {
    res.end(
      JSON.stringify({
      legend: row.current,
      previous: row.previous,
      since: row.since
      })
    );
  });
});

/**
 * Update the current legend
 */
router.post('/', function (req, res) {
  db.get(''+ // Get the LAST legend
  'SELECT current FROM legend WHERE id = (SELECT MAX(id) FROM legend)' +
    '', function (err, row) {

    var response = {
      legend: req.body.newLegend,
      previous: row.current,
      since: moment().format('D MMMM YYYY HH:mm') // NOW (server time)
    };

    var query = '' +
      'INSERT INTO legend ' +
      '(current, previous, since) ' +
      'VALUES ' +
      '(\'' + response.legend + '\', \'' + response.previous + '\', \'' + response.since  +'\')';

    db.run(query);

    res.end(JSON.stringify(response));
  })
});

app.listen(config.port);

module.exports = app;
