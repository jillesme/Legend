var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();

var moment = require('moment');
var sqlite3 = require('sqlite3');

var utils = require('../utils.js');
var sql = require('../sql.js');

/* Connect to db */
var config = require('../config');
var db = new sqlite3.Database(config.dbFile);

/* Remove this vile code when we're deployed */
router.all('/api', function(req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
});

/* Google OAUTH */
router.get('/', function (req, res) {
  var index = path.resolve(__dirname + '/../build/index.html');
  res.sendfile(index);
});

router.get('/verify', passport.authenticate('google', {
  scope: 'https://www.googleapis.com/auth/userinfo.email'
}));

router.get('/verify/callback', passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/'
}));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

/**
 * Suffice client with the current legend and the previous one
 */
router.get('/api', function (req, res) {
  var user = req.session.passport.user;
  db.get(sql.getLegend, function(err, row) {
    var response = {
      legend: row.current,
      previous: row.previous,
      since: row.since,
      userAuthenticated: !!user
    };

    if (!!user) { response.user = utils.buildUserObj(user); }

    res.end(
      JSON.stringify(response)
    );
  });
});

/**
 * Update the current legend
 */
router.post('/api', function (req, res) {
  db.get(sql.getLastLegend, function (err, row) {

    var current = row.current;

    // Check if user is the current legend
    if (current !== req.session.passport.user.displayName) {
      res.status(403);
      res.end(JSON.stringify({
        error: 'You are not the legend'
      }));
      return;
    }

    var response = {
      legend: req.body.newLegend,
      previous: current,
      since: moment().format('D MMMM YYYY HH:mm') // NOW (server time)
    };

    var query = sql.setLegend
                .replace('[legend]', response.legend)
                .replace('[previous]', response.previous)
                .replace('[since]', response.since);

    db.run(query);

    res.end(JSON.stringify(response));
  });
});

module.exports = router;
