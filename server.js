/* Requirements */
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');

/* Init a new app */
var app = express();
var routes = require('./routes');

var config = require('./config');

/* bodyParser is so we can read POSTed json data */
app.use(bodyParser.json());
app.use(session({
  secret: 'being-fat-is-unhealthy',
  resave: false,
  saveUninitialized: false
}));
/* Passport for Google Auth */
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/build'));
app.use(routes);

/* serialize the session into user */
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

/* Passsport for OAUTH */
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: '97694017682-dn8vk52g0m5807avc8dtu2r37caseq5f.apps.googleusercontent.com',
    clientSecret: 'dTm2P85HtZ7qa9LsjN8KdtqT',
    callbackURL: 'http://localhost:3000/verify/callback',
    passReqToCallback: true
  }, function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.listen(config.port);

module.exports = app;
