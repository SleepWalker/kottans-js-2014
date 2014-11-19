function checkUsersValid(goodUsers) {
    var userMap = goodUsers.reduce(function(map, user) {
        map[user.id] = true;
        return map;
    }, {});

    return function(submittedUsers) {
        return submittedUsers.every(function(user) {
            return userMap[user.id];
        });
    };
}

module.exports = checkUsersValid;
