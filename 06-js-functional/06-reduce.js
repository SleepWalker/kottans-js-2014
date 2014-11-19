function countWords(inputWords) {
    return inputWords.reduce(function(list, current) {
        list[current] = (list[current]+1) || 1;

        return list;
    }, {});
}

module.exports = countWords;
