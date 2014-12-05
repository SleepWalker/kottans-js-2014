function DatingClient() {}

// TODO: создать обвертку, которая будет приводить все ошибки к единому формату
//       использовать ее либо для всех запросов, либо только в тех местах, где есть форма и надо вывести информацию

// TODO: не пускать логиниться залогиненного
// TODO: общую часть тестов Login и Register вынести в отдельный тест низкоуровневых функций

// TODO: FP

// TODO: Loader queue (ui dir), asset manager
// TODO: app namespace


//TODO: "pushState" in history

(function() {
    'use strict';

    var apiUrl = 'http://api.sudodoki.name:8888/';
    DatingClient.prototype = $.extend(DatingClient.prototype, {
        _token: false,

        login: function(credentials) {
            if (!credentials.login || !credentials.password) {
                throw new Error('Need credentials in order to login');
            }

            return this._handleRequestPromise(this._post('login', credentials));
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

            if (arguments.length == 0) {
                throw new Error('Need at least one argument');
            }

            return this._get('user/'+id);
        },

        isAuthorized: function() {
            return !!this._token;
        },

        _handleRequestPromise: function(promise) {
            var that = this;
            return promise
               .then(function(data) {
                    that._token = data.token;
                    return that.isAuthorized() ? that._token : Promise.reject({errorMessage: 'Can\'t signin: empty token'});
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
                    'SECRET-TOKEN': this._token
                };
            }
        }
    });

    function normalizeApiErrors(data) {
        var errorMessage = data.error;
        var errorDetails = data.errors;
        if (errorDetails) {
            errorDetails = errorDetails.reduce(function(acc, error) {
                var attribute = Object.keys(error)[0];
                acc[attribute] = error[attribute];

                return acc;
            }, {});
        } else if (!errorMessage) {
            errorMessage = 'Unknown error';
        }

        return {
            errorMessage: errorMessage,
            errorDetails: errorDetails,
        };
    }
}());