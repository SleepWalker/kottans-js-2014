var _ = require("lodash");

var worker = function(list) {
    return _.chain(list)
        .groupBy('article')
        .reduce(function(newList, theSameArticles) {
            return newList.concat({
                article: theSameArticles[0].article,
                total_orders: _.reduce(theSameArticles, function(acc, obj) {
                    return acc + obj.quantity;
                }, 0)
            });
        }, [])
        .sortBy('total_orders')
        .reverse()
        .value();
};

module.exports = worker;
