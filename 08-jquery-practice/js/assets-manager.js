function AssetsManager() {}

/**
 * TODO: caching
 * должен привязываться к версии приложения
 * должен хранить номер прошлой версии и стирать старые кэши, если версия поменялась
 *
 * TODO: подумать, возможно есть смысл оставить какю-то из известных API, аля AMD, commonJs
 *
 * NOTE: when some module does not support assets manager, it should go after all modules
 *       that support assets manager.
 */

(function() {
    'use strict';

    var assets = {};
    var defineQueue = [];

    function addAsset(file) {
        return $.getScript(file).then(function() {
            return defineQueue.shift();
        });
    }

    function notRegisteredAsset(module) {
        return !assets[module];
    }

    function unique(item, index, arr) {
        return arr.indexOf(item) === index;
    }

    AssetsManager.prototype = $.extend(AssetsManager.prototype, {
        require: function(modules) {
            if (!$.isArray(modules) || !modules.length) {
                throw new Error('The first arg should be non empty array');
            }

            var newModules = modules
                .filter(unique)
                .filter(notRegisteredAsset)
                ;

            assets = newModules.reduce(function(assets, moduleId) {
                assets[moduleId] = new Promise(function(resolve, reject) {
                    addAsset(moduleId).then(resolve, reject);
                });

                return assets;
            }, assets);

            var promises = modules.map(function(moduleId) {
                return assets[moduleId];
            });

            return Promise.all(promises);
        },

        module: function() {
            function exports(callback, modules) {
                if (!$.isFunction(callback)) {
                    throw new Error('The first arg should be a function');
                }

                defineQueue.push(callback(modules));
            }

            return {
                requires: function(dependencies) {
                    var promise = require(dependencies);

                    return {
                        exports: function(callback) {
                            promise.then(exports.bind(this, callback));
                        }
                    };
                },

                exports: exports
            };
        },

        // for unit testing purposes
        _reset: function() {
            assets = [];
        }
    });

    var manager = new AssetsManager();

    window.require = manager.require.bind(manager);
    window.module = manager.module.bind(manager);
}());