var _ = require("lodash");

function gt(num) {
    return function(value) {
        return value > num;
    };
}

var worker = function(towns) {
    return _.reduce(towns, function(sortedTowns, temperatures, town) {
        if (_.every(temperatures, gt(19))) {
            sortedTowns.hot.push(town);
        } else if (_.some(temperatures, gt(19))) {
            sortedTowns.warm.push(town);
        }

        return sortedTowns;
    }, {hot: [], warm: []});
};

module.exports = worker;