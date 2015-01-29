function Emitter() {}
// TODO: tests
Emitter.mixinTo = function(obj) {
    function kickEventVar(func) {
        return function() {
            return func.apply(func, [].slice.call(arguments, 1));
        };
    }

    function prepareEventArgs(event, func) {
        var args = [];
        event && args.push(event);
        func && args.push(kickEventVar(func));

        return args;
    }

    var emitter = $({});
    obj.prototype = $.extend(obj.prototype, {
        on: function(event, func) {
            emitter.on.apply(emitter, prepareEventArgs(event, func));

            return this;
        },

        off: function(event, func) {
            emitter.off.apply(emitter, prepareEventArgs(event, func));

            return this;
        },

        trigger: function(event, params) {
            emitter.trigger.call(emitter, event, params);

            return this;
        }
    });
};