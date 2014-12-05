var assetsManager = (function() {
    'use strict';

    function AssetsManager() {}

    var assets = [];

    function getScript(file) {
        return $.getScript(file);
    }

    AssetsManager.prototype = $.extend(AssetsManager.prototype, {
        require: function(files) {
            if (!$.isArray(files) || !files.length) {
                throw new Error('The first arg should be an array');
            }

            files = files
                .filter(function(file, index, files) {return files.indexOf(file) === index;})
                // TODO: curry inArray(haysack, needle)
                .filter(function(file) {return assets.indexOf(file) == -1;});
            assets = assets.concat(files);

            var deferreds = files.map(getScript);

            return Promise.all(deferreds);
        },

        // for unit testing purposes
        _reset: function() {
            assets = [];
        }
    });

    return new AssetsManager();
}());