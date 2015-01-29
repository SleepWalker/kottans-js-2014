var app = {
    actions: {
        'login': {
            'destination': '#login .section__content',
            'isAllowed': function() {
                return !app.client.isAuthorized();
            },
        },
        'logout': {
            'isAllowed': function() {
                return app.client.isAuthorized();
            },
        },
        'signup': {
            'destination': '#signup .section__content',
            'isAllowed': function() {
                return !app.client.isAuthorized();
            },
        },
        'list': {
            'destination': '#list .section__content',
            'isAllowed': function() {
                return true;
            },
        },
        'user': {
            'destination': '#user .section__content',
            'isAllowed': function() {
                var action = app.router.getAction();
                var show = app.client.isAuthorized() && action.id == 'user' && action.params.length;
                if (show) {
                    $('#nav [href*=#user]')[0].href = '#' + action.id + '/' + action.params[0];
                }

                return show;
            },
        }
    },

    updateNav: function() {
        // TODO: bind this method to change of user auth status event in client.js
        var that = this;
        $('#nav a').each(function() {
            var toggleVisibility = that.isAllowedAction(this.hash.slice(1)) ? 'show' : 'hide';
            $(this).closest('li')[toggleVisibility]();
        });
    },

    init: function() {
        var initPromises = [];
        initPromises.push(this.domReadyPromise());
        initPromises.push($.getScript('js/assets-manager.js'));


        initPromises.push(new Promise(function simulationFn(resolve) {
            initPromises[0].then(function() {
                var loader = new PathLoader(document.getElementById('init-loader-progress'));
                var progress = 0;
                var interval = setInterval( function() {
                        progress = Math.min(progress + Math.random() * 0.1, 1);
                        loader.setProgress(progress);
                        // reached the end
                        if(progress === 1) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100 );
            });
        }));

        return Promise.all(initPromises);
    },

    run: function() {
        this.assetsManager = new AssetsManager();

        return this.assetsManager.require([
            'js/client.js',
            'js/renderer.js',
            'js/emitter.js', // TODO: move to modules
            'js/router.js',
            'js/ui/navigation.js',
            'js/ui/ajax-loader.js'
        ])
        .then(this.initComponents)
        .then(this.setLoaded)
        .then(this.runAction)
        ;
    },

    initComponents: function() {
        this.client = new DatingClient();
        this.router = new Router();
        this.renderer = new Renderer();
        this.ajaxLoader = new AjaxLoader();
        this.ajaxLoader.registerLoader($('.loader')[0]);
        this.navigation = new Navigation($('.section'));

        $('body').on('click', '.js-nav-trigger, #nav a', function(event) {
            if ($(this).hasClass('js-nav-trigger')) {
                event.preventDefault();
                event.stopPropagation();
            }

            $(this).closest('nav').toggleClass('is-active');
        });

        this.router.on('change', this.runAction);
    },

    setLoaded: function() {
        $('#app').addClass('is-loaded');
    },

    runAction: function(actionId, params) {
        if (!actionId) {
            actionId = this.router.getAction().id;
            params = this.router.getAction().params;
        }

        if (!actionId) {
            this.redirect(this.getDefaultAction());
            return;
        }

        if (this.isAllowedAction(actionId)) {
            this[actionId + 'Action'](params)
                .then(this.navigation.navigateTo.bind(this.navigation, actionId))
                .then(this.updateNav)
                .catch(function() {
                   console.error('Error runing action:', arguments);
                   alert('Error runing action');
                })
                ;
        } else {
            this.redirect(this.getDefaultAction());
            console.error('Action ' + actionId + ' is not permitted');
        }
    },

    getDefaultAction: function() {
        return app.client.isAuthorized() ? 'list' : 'login';
    },

    redirect: function(actionId) {
        var id = '#' + actionId;
        var title = $('#nav a[href*='+id+']').text();

        this.router.go(id, title);
    },

    listAction: function() {
        var destination = this.actions[this.router.getAction().id].destination;

        return this.client.getUsers()
            .then(function (users) {
                return users.map(function normalizeUser(user) {
                    return $.extend({
                        id: user.id,
                        gender: user.user.gender
                    }, extractUserName(user.user.name));
                });
            })
            .then(function(users) {
                return app.renderer.getTemplate('tpl/person-card.tpl')
                    .then(app.renderer.empty(destination))
                    .then([].map.bind(users))
                    .then(app.renderer.appendTo($('<ul>').addClass('person-list')))
                    .then(app.renderer.appendTo(destination))
                    ;
            })
            ;
    },

    loginAction: function() {
        var destination = this.actions[this.router.getAction().id].destination;
        var $el = $('<div>');

        return this.assetsManager.require([
            'js/vendor/parsley.min.js'
        ]).then(function() {
            return app.renderer.getTemplate('tpl/login-form.tpl')
                .then(app.renderer.empty(destination))
                .then(app.renderer.appendTo($el))
                .then(app.renderer.appendTo(destination))
                .then(bindForm($el, function(data) {
                    app.client.login(data)
                        .then(function() {
                            app.redirect('list');
                        })
                        .catch(addFormErrors.bind(null, $el))
                        ;
                }))
                ;
        })
        ;
    },

    logoutAction: function() {
        this.client.logout();
        this.redirect('login');
    },

    signupAction: function() {
        var destination = this.actions[this.router.getAction().id].destination;
        var $el = $('<div>');

        return this.assetsManager.require([
            'js/vendor/parsley.min.js'
        ]).then(function() {
            return app.renderer.getTemplate('tpl/signup-form.tpl')
                .then(app.renderer.empty(destination))
                .then(app.renderer.appendTo($el))
                .then(app.renderer.appendTo(destination))
                .then(bindForm($el, function(data) {
                    app.client.register(data)
                        .then(function() {
                            app.redirect('list');
                        })
                        .catch(addFormErrors.bind(null, $el))
                        ;
                }))
                ;
        })
        ;
    },

    userAction: function(params) {
        var destination = this.actions[this.router.getAction().id].destination;

        return this.client.getUser(params[0])
            .then(function normalizeUser(user) {
                user = user[0];
                return $.extend({
                        id: user.id,
                        gender: user.user.gender,
                        SSN: user.user.SSN,
                        phone: user.user.phone,
                        cell: user.user.cell,
                        email: user.user.email
                    }, extractUserName(user.user.name), extractUserLocation(user.user.location));
            })
            .then(function(user) {
                return app.renderer.getTemplate('tpl/person-profile.tpl')
                    .then(app.renderer.empty(destination))
                    .then([].reduce.bind([user, '<-- render this']))
                    .then(app.renderer.appendTo($('<div>')))
                    .then(app.renderer.appendTo(destination))
                    ;
            })
            .catch(function() {
                alert('Bad request');
                console.error('Bad Request:', params, arguments);
                app.redirect('list');
            })
            ;

    },

    isAllowedAction: function(actionId) {
        return !!this.actions[this.router.parseUrl(actionId).id].isAllowed();
    },

    domReadyPromise: function() {
        var domReady = new $.Deferred();
        $($.proxy(domReady.resolve, domReady));
        return domReady;
    }
};

$.each(app, function(key, func) {
    if ($.isFunction(func)) {
        app[key] = $.proxy(func, app);
    }
});

app.init()
   .then(app.run)
   .catch(function() {
       console.error('Error loading app:', arguments);
       alert('Error loading app');
   });

// TODO: bind-form.js
function bindForm($el, callback) {
    return function(input) {
        var $form = $el.find('form');
        var foundationParsleyConfig = {
            classHandler: function(ParsleyField) {
                return ParsleyField.$element.parent();
            },
            errorClass: 'error',
            errorsWrapper: '<small class="error"></small>',
            errorTemplate: '<span></span>'
        };

        var parsley = $form.parsley(foundationParsleyConfig);
        $.listen('parsley:field:validate', function clearManualErorrs(field) {
            ParsleyUI.removeError(field, 'manual');
        });

        $el.on('submit', 'form', function(event) {
            event.preventDefault();
            function serializeObject(acc, item) {
                acc[item.name] = item.value;

                return acc;
            }

            if (callback) {
                var data = $(this)
                    .serializeArray()
                    .reduce(serializeObject, {});
                callback(data);
            }
        });
    };
}

function addFormErrors($form, errors) {
    function addError($field, message) {
        var parsley = $field.parsley();
        ParsleyUI.addError(
            $field.parsley(),
            'manual',
            message
        );
    }

    if (errors.details) {
        $.each(errors.details, function(key, message) {
            var $field = $form.find('[name="'+key+'"]').first();
            if ($field.length) {
                addError($field, message);
            }
        });
    }

    if (errors.message) {
        var $field = $form.find('[type="text"]').first();
        if ($field.length) {
            addError($field, errors.message);
        }
    }
}

function extractUserName(name) {
    return {
        first: capitalize(name.first),
        last: capitalize(name.last),
        title: capitalize(name.title)+'.'
    };
}

function extractUserLocation(location) {
    return {
        location: [
            location.street,
            location.city,
            location.state,
            location.zip
        ].map(capitalize).join(', ')
    };
}

function capitalize(value) {
    return value[0].toUpperCase()+value.slice(1);
}


function PathLoader(el) {
    this.el = el;
    // clear stroke
    this.el.style.strokeDasharray = this.el.style.strokeDashoffset = this.el.getTotalLength();
}

PathLoader.prototype._draw = function(val) {
    this.el.style.strokeDashoffset = this.el.getTotalLength() * (1 - val);
};

PathLoader.prototype.setProgress = function(val, callback) {
    this._draw(val);
    if(callback && typeof callback === 'function') {
        // give it a time (ideally the same like the transition time) so that the last progress increment animation is still visible.
        setTimeout(callback, 200);
    }
};