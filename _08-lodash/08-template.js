var _ = require("lodash");

var worker = function(user) {
    return _.template('Hello <%= name %> (logins: <%= login.length %>)', user);
};

module.exports = worker;