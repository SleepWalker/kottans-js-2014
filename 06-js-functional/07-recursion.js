function reduce(arr, fn, initial, index) {
    index = index || 0;

    if (arr.length === index) {
        return initial;
    }

    initial = fn(initial, arr[index], index, arr);
    return reduce(arr, fn, initial, ++index);
}

module.exports = reduce;
