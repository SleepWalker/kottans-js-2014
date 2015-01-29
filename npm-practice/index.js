function checkIsNumber(x) {
    if (typeof x !== 'number') {
        throw new TypeError(x + ' is not number');
    }
}

function checkNumbers(a, b) {
    checkIsNumber(a);
    checkIsNumber(b);
}

exports.add = function (a, b) {
    checkNumbers(a, b);
    return a + b;
};

exports.sub = function (a, b) {
    checkNumbers(a, b);
    return a - b;
};

exports.mul = function (a, b) {
    checkNumbers(a, b);
    return a * b;
};

exports.div = function (a, b) {
    checkNumbers(a, b);
    return a / b;
};