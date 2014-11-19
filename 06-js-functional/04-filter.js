module.exports = function getShortMessages(messages) {
    return messages.filter(function(data) {
        return data.message.length < 50;
    }).map(function (data) {
        return data.message;
    });
};
