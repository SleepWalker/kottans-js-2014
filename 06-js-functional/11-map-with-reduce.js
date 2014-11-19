module.exports = function arrayMap(arr, fn) {
    return arr.reduce(function(ret, value, index) {
        ret[index] = fn(value);

        return ret;
    }, []);
}
