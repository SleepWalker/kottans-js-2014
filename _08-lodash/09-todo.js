var _ = require("lodash");

var worker = function(users) {
    return _.template('<ul>' +
        '<% _.forEach(users, function(todo, name) { %>' +
            '<li><%= name %>' +
                '<ul>' +
                '<% _(todo).sortBy("date").forEach(function(task) { %>' +
                    '<li><% if(urgent(task.date)) { %><b>URGENT</b> <% } %><%= task.todo %></li>' +
                '<% }) %>' +
                '</ul>' +
            '</li>' +
        '<% }) %>' +
    '</ul>', {
        users: users
    }, {
        imports: {
            urgent: function urgent(date) {
                var now = new Date();
                var deadLine = new Date(date);
                var delta = deadLine - now;
                var twoDays = 1000 * 60 * 60 * 24 * 2;
                return delta <= twoDays;
            }
        }
    });
};

module.exports = worker;
