function AjaxLoader() {
    this.init();
}

(function addXhrProgressEvent($) {
    // Patch for progress event support
    var originalXhr = $.ajaxSettings.xhr;

    $.ajaxSetup({
        progress: $.noop,
        xhr: function() {
            var xhr = originalXhr(), that = this;
            if (xhr) {
                if (typeof xhr.addEventListener == "function") {
                    xhr.addEventListener("progress", function(event) {
                        that.progress(event);

                        if (that.global) {
                            var event = $.Event('ajaxProgress', event);
                            event.type = 'ajaxProgress';
                            $(document).trigger(event);
                        }
                    },false);
                }
            }
            return xhr;
        }
    });
})(jQuery);

(function() {
    'use strict';

    var queue = [];
    var loaders = [];

    function activate(el) {
        $(el).addClass('is-active');
    }

    function deactivate(el) {
        $(el).removeClass('is-active');
    }

    AjaxLoader.prototype = $.extend(AjaxLoader.prototype, {
        transitionDelay: 100,
        _currentTimer: false,

        init: function() {
            $(document).on('ajaxSend', this.start.bind(this));
            $(document).on('ajaxComplete ajaxError', this.stop.bind(this));
            $(document).on('ajaxProgress', this._handleProgress.bind(this));
        },

        isBusy: function() {
            return !!queue.length;
        },

        start: function(_, __, options) {
            queue.push(1);

            if (this._currentTimer) {
                clearTimeout(this._currentTimer);
                this._currentTimer = false;
            }

            loaders.forEach(activate);
        },

        stop: function() {
            queue.pop();

            this.trigger('progress', [100]);

            if (!queue.length) {
                this._currentTimer = setTimeout(function() {
                    loaders.forEach(deactivate);
                }, this.transitionDelay);
            }
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
                deactivate(
                    loaders
                        .splice(loaders.indexOf(el), 1)
                );
            }
        },

        hasLoader: function(el) {
            return loaders.indexOf(el) > -1;
        },

        _handleProgress: function(event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total;
                // TODO:
            }
        }
    });

    Emitter.mixinTo(AjaxLoader);
}());