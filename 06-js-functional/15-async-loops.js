function loadUsers(userIds, load, done) {
    'use strict';

    var users = [];
    var len = userIds.length;

    userIds.forEach(function(userId, index) {
        load(userId, function (userModel) {
            users[index] = userModel;

            return --len || done(users);
        });
    });
}

module.exports = loadUsers;
