function Router() {
    this.init();
    this._setEvents();
}

(function() {
    'use strict';

    /**
     * NOTE: Supporting only hash navigation
     */

    var currentAction;

    Router.prototype = $.extend(Router.prototype, {
        init: function() {
            currentAction = this.parseUrl(location.hash);
        },

        parseUrl: function(url) {
            var parts = url.replace(/[^#]*#/, '').split('/');

            if (!parts[0]) {
                return [];
            }

            var args = [parts[0]];

            if (parts.length > 1) {
                args.push(parts.slice(1));
            } else {
                args.push([]);
            }

            return {
                id: args[0],
                params: args[1]
            };
        },

        getAction: function() {
            return $.extend({}, currentAction);
        },

        go: function(url, title) {
            var route = url.replace(/^https?:\/\/[^#]+\/?/, '');
            url = location.origin + location.pathname + route;

            history.pushState(null, title, url);

            this._route(url);
        },

        _route: function(url) {
            var action = this.parseUrl(url);

            if (!action.id) {
                return false;
            }

            currentAction = this.parseUrl(location.hash);

            this.trigger('change', [action.id, action.params]);
        },

        _routeLink: function(event) {
            event.preventDefault();

            this.go(event.currentTarget.href, $(event.currentTarget).text());
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

    Emitter.mixinTo(Router);
}());
