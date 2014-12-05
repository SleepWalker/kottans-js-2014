var ajaxLoader = (function() {
    'use strict';

    var queue = [];
    var loaders = [];

    function AjaxLoader() {
        this.init();
    }

    function activate(el) {
        $(el).addClass('is-active');
    }

    function deactivate(el) {
        $(el).removeClass('is-active');
    }

    AjaxLoader.prototype = $.extend(AjaxLoader.prototype, {
        init: function() {
            $(document).on('ajaxSend', $.proxy(this.start, this));
            $(document).on('ajaxComplete', $.proxy(this.stop, this));
        },

        isBusy: function() {
            return !!queue.length;
        },

        start: function() {
            queue.push(1);

            loaders.forEach(activate);
        },

        stop: function() {
            queue.pop();
        },

        reset: function() {
            queue = [];
        },

        registerLoader: function(el) {
            loaders.push(el);

            if (this.isBusy()) {
                activate(el);
            }
        },

        unregisterAllLoaders: function() {
            loaders.forEach(deactivate);

            loaders = [];
        },

        unregisterLoader: function(el) {
            if (this.hasLoader(el)) {
                // TODO: chain
                deactivate(
                    loaders
                        .splice(loaders.indexOf(el), 1)
                );
            }
        },

        hasLoader: function(el) {
            return loaders.indexOf(el) > -1;
        }
    });

    return new AjaxLoader();
}());