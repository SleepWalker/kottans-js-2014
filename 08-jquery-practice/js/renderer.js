function Renderer() {}

(function() {
    var cache = {};
    Renderer.prototype = $.extend(Renderer.prototype, {
        getTemplate: function(src) {
            var that = this;
            return new Promise(function(resolve, reject) {
                $.get(src).then(function(tpl) {
                    cache[src] = tpl;

                    resolve(that.compile(tpl));
                }, reject);
            });
        },

        /**
         * Outputs a new function with interpolated object property values.
         * Use like so:
         * var fn = makeInterpolator('some/url/{param1}/{param2}');
         * fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
         */
        compile: (function() {
            var rc = {
                '\n': '\\n', '\"': '\\\"',
                '\u2028': '\\u2028', '\u2029': '\\u2029'
            };
            return function makeInterpolator(str) {
                return new Function(
                    'o',
                    'return "' + (
                        str
                            .replace(/["\n\r\u2028\u2029]/g, function($0) {
                                return rc[$0];
                            })
                            .replace(/\{\{([\s\S]+?)\}\}/g, '" + o["$1"] + "')
                    ) + '";'
                );
            };
        }()),

        /**
         * Curried implementation of $().appendTo
         * @param  string|$ destination DOM element, $() or selector where to put results
         */
        appendTo: function(destination) {
            destination = $(destination);
            function append(content) {
                destination.append(content);
            }

            return function(content) {
                if ($.isArray(content)) {
                    content.forEach(append);
                } else {
                    append(content);
                }

                return destination;
            };
        },

        empty: function(selector) {
            return function(firstArg) {
                $(selector).empty();

                return firstArg;
            };
        }
    });
}());