var my_$ = (function () {
    'use strict';

    var $ = function $(selector) {
        if (this instanceof $) {
            this.nodesList = document.querySelectorAll(selector);
            this.length = this.nodesList.length;

            return this;
        } else {
            return new $(selector);
        }
    };

    $.isString = function(value) {
        return typeof value == 'string';
    };

    $.isEnumerable = function(value) {
        return value && ($.isObject(value) || $.isArray(value));
    };

    $.isObject = function(value) {
        return typeof value === 'object';
    };

    $.isArray = function(value) {
        return value.constructor === Array;
    };

    $.isNumber = function(value) {
        return !jQuery.isArray(value) && (value - parseFloat(value) + 1) >= 0;
    };

    $.extend = (function () {
        function deepCopy() {
            var destination;
            var sources;

            if (arguments.length < 1) {
                throw new Error('Need at least one argument to do deep copy');
            }

            if (!$.isEnumerable(arguments[0])) {
                return arguments[0];
            }

            if (arguments.length == 1) {
                destination = {};
                sources = [arguments[0]];
            } else {
                destination = arguments[0];
                sources = [].slice.call(arguments, 1);
            }

            sources.forEach(function (source) {
                copyOwnProperties(destination, source);
            });

            return destination;
        }

        function copyOwnProperties(destination, source) {
            Object.keys(source).forEach(function (key) {
                destination[key] = filterValue(source[key]);
            });

            return destination;
        }

        function filterValue(value) {
            if ($.isArray(value)) {
                return copyOwnProperties([], value);
            } else if ($.isObject(value)) {
                return copyOwnProperties({}, value);
            } else {
                return value;
            }
        }

        return deepCopy;
    }());

    $.prototype = $.extend($.prototype, {
        width: function (width) {
            if (width === undefined) {
                return this._getCssProp('width');
            } else {
                return this.css('width', width);
            }
        },

        height: function (height) {
            if (height === undefined) {
                return this._getCssProp('height');
            } else {
                return this.css('height', height);
            }
        },

        _getCssProp: function(prop) {
            return this.asArray().reduce(function (values, el) {
                values.push(window.getComputedStyle(el)[prop]);

                return values;
            }, []);
        },

        css: function(key, value, delay) {
            var hasDelay = $.isNumber(delay) || ($.isNumber(value) && $.isObject(key));
            if (hasDelay) {
                var args = [].slice.call(arguments);
                setTimeout(Function.bind.apply(this.css, [this].concat(args.slice(0, -1))), args.pop());
                return this;
            }

            if ($.isObject(key)) {
                var styles = key;

                this.forEach(function(el) {
                   $.extend(el.style, styles);
                });
            } else {
                this.forEach(function(el) {
                   el.style[key] = value;
                });
            }

            return this;
        },

        asArray: function() {
            return [].slice.call(this.nodesList);
        },

        forEach: function(callback) {
            this.asArray().forEach(callback);

            return this;
        }
    });

    return $;
}());