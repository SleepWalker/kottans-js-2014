var _ = require('lodash');

var sorter = _.partialRight(_.sortBy, 'quantity');

module.exports = _.compose(Function.prototype.call.bind([].reverse), sorter);
