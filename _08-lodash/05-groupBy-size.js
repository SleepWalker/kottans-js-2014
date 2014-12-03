var _ = require("lodash");

var worker = function(comments) {
    return _(comments)
        .groupBy('username')
        .map(function(amount, username) {
            return {
                username: username,
                comment_count: _.size(amount)
            };
        })
        .sortBy('comment_count')
        .reverse()
        .value();
};

module.exports = worker;