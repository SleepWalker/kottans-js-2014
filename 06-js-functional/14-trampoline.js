function repeat(operation, num) {
    'use strict';

    return function() {
        if (num <= 0) return;
        operation();
        return repeat(operation, --num);
    };
}

function trampoline(fn) {
    'use strict';
    if (isFunction(fn)) {
        while (isFunction(fn())) {}
    }
}

function isFunction(fn) {
    'use strict';
    return !!(fn && fn.constructor && fn.call && fn.apply);
}

module.exports = function(operation, num) {
    'use strict';
    return trampoline(repeat(operation, num));
};