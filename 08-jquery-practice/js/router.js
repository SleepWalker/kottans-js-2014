var router = (function() {
    'use strict';

    /**
     * NOTE: Supporting only hash navigation
     */

    function Router() {
        this._setEvents();
    }

    var emitter = $({});

    Router.prototype = $.extend(Router.prototype, {
        on: function(event, func) {
            emitter.on.apply(emitter, [].slice.call(arguments, 0, 2));

            return this;
        },

        off: function(event, func) {
            emitter.off.apply(emitter, [].slice.call(arguments, 0, 2));

            return this;
        },

        _route: function(url) {
            var parts = url.replace('#', '').split('/');

            if (!url[0]) {
                return;
            }

            var args = [parts[0]];

            if (parts.length > 1) {
                args.push(parts.slice(1));
            }

            emitter.trigger('change', args);
        },

        _routeLink: function(event) {
            event.preventDefault();

            history.pushState(null, $(event.target).text(), event.target.href);

            this._route(event.target.hash);
        },

        _statePopped: function(event) {

            this._route(location.hash);
        },

        _setEvents: function() {
            window.addEventListener("popstate", $.proxy(this._statePopped, this));

            $($.proxy(function() {
                $('body').on('click', 'a', $.proxy(this._routeLink, this));
            }, this));
        }
    });

    return new Router();
}());