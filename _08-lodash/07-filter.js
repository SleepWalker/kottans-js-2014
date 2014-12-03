var _ = require("lodash");

var worker = function(freelancers) {
    var average = _(freelancers)
        .pluck('income')
        .reduce(function(acc, income) {return acc + income;}, 0) / _.size(freelancers);

    return {
        average: average,
        underperform: _(freelancers).filter(function(freelancer) {
                return freelancer.income <= average;
            })
            .sortBy('income')
            .value(),
        overperform: _(freelancers).filter(function(freelancer) {
                return freelancer.income > average;
            })
            .sortBy('income')
            .value()
    };
};

module.exports = worker;
