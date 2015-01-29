function DatingClient() {}

// TODO: общую часть тестов Login и Register вынести в отдельный тест низкоуровневых функций
// TODO: AMD like loader based on promises x.module('...').requires([]).defines(function(){})
// TODO: base object to bind views with corresponding events, ak comutator. so that views will be isolated from the app
// TODO: create nav dynamically based on available actions (?)
// TODO: ES6 features
// TODO: docs headers for each file
// TODO: template caching
// TODO: script caching

// TODO: FP
// TODO: ES6 promises + yield

//TODO: feature detection: "pushState" in history
//TODO: feature detection: "getItem" in localStorage

(function() {
    'use strict';

    var apiUrl = 'http://api.sudodoki.name:8888/';

    DatingClient.prototype = $.extend(DatingClient.prototype, {
        sessionKey: 'dating-secret',

        login: function(credentials) {
            if (!credentials.login || !credentials.password) {
                throw new Error('Need credentials in order to login');
            }

            return this._handleRequestPromise(this._post('login', credentials));
        },

        logout: function() {
            localStorage.removeItem(this.sessionKey);
        },

        register: function(credentials) {
            if (!credentials.login ||
                !credentials.password ||
                !credentials.passwordConfirmation ||
                credentials.password != credentials.passwordConfirmation
                ) {
                throw new Error('Need credentials in order to register');
            }

            return this._handleRequestPromise(this._post('signup', credentials));
        },

        getUsers: function() {
            return this._get('users');
        },

        getUser: function(id) {
            if (!this.isAuthorized()) {
                throw new Error('Not authorized. Need token');
            }

            if (!arguments.length) {
                throw new Error('Need at least one argument');
            }

            return this._get('user/'+id);
        },

        setToken: function(token) {
            localStorage.setItem(this.sessionKey, token);
        },

        getToken: function() {
            return localStorage.getItem(this.sessionKey);
        },

        isAuthorized: function() {
            return !!this.getToken();
        },

        _handleRequestPromise: function(promise) {
            var that = this;
            return promise
               .then(function(data) {
                    that.setToken(data.token);
                    return that.isAuthorized() ? that.getToken() : Promise.reject({errorMessage: 'Can\'t signin: empty token'});
               })
               .catch(function(data) {
                    var errors = normalizeApiErrors(data);
                    return Promise.reject(errors);
               });
        },

        _get: function(action, data) {
            return this._apiRequest('get', action, data);
        },

        _post: function(action, data) {
            return this._apiRequest('post', action, data);
        },

        _apiRequest: function (method, action, data) {
            if (arguments.length < 2) {
                throw new Error('Expected at least 2 arguments');
            }

            var that = this;

            return new Promise(function(resolve, reject) {
                $.ajax(apiUrl + action, {
                    dataType: 'html',
                    type: method,
                    headers: that._getRequestHeaders(),
                    data: {
                        data: data
                    },
                    complete: function(jqXHR, status) {
                        var json = JSON.parse(jqXHR.responseText);
                        [reject, resolve][(status == 'success')*1](json);
                    },
                });
            });
        },

        _getRequestHeaders: function() {
            if (this.isAuthorized()) {
                return {
                    'SECRET-TOKEN': this.getToken()
                };
            }
        }
    });

    function normalizeApiErrors(data) {
        var message = data.error;
        var details = data.errors;
        if (details) {
            details = details.reduce(function(acc, error) {
                var attribute = Object.keys(error)[0];
                acc[attribute] = error[attribute];

                return acc;
            }, {});
        } else if (!message) {
            message = 'Unknown error';
        }

        return {
            message: message,
            details: details,
        };
    }
}());