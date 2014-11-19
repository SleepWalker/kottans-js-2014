function Spy(target, method) {
    var orig = target[method];

    target[method] = function spy() {
        spy.count = ++spy.count || 1;

        return orig.apply(target, Array.prototype.slice.call(arguments));
    };

    return target[method];
}

module.exports = Spy;
