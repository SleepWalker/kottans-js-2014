function curryN(fn, n) {
    'use strict';

    n = n || fn.length;

    var recievedArgs = [];

    return function superCurry(value) {
        var isFullStack = recievedArgs.length == (n-1);
        if (!isFullStack) {
            recievedArgs.push(value);

            return superCurry;
        } else {
            return fn.apply(null, recievedArgs.concat(value));
        }
    };
}

module.exports = curryN;
