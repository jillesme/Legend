var utils = {};

utils.buildUserObj = function (usr) {
  return {
    name: usr.displayName,
    email: usr.emails[0].value,
    image: usr._json.picture
  };
};

module.exports = utils;
