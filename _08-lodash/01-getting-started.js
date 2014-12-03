var _ = require("lodash");

module.exports = _.partialRight(_.where, {active: true});