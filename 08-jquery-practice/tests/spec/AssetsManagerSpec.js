describe('AjaxLoader', function() {
    'use strict';

    var styleFile = 'lib/jasmine-2.1.3/jasmine.css'; // TODO: it would be cool to support this
    var imageFile = 'lib/jasmine-2.1.3/jasmine_favicon.png'; // TODO: it would be cool to support this
    var scriptFile1 = 'fake1.js';
    var scriptFile2 = 'fake2.js';
    var resolved = new Promise(function(resolve) {resolve({status: 200})});

    beforeEach(function() {
        assetsManager._reset();
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe('#require', function() {
        it('should be defined', function() {
            expect(assetsManager.require).toBeDefined();
        });

        it('should require array', function() {
            var req = function() {
                assetsManager.require({});
            };

            expect(req).toThrow();
        });

        it('should return promise', function() {
            expect(assetsManager.require([scriptFile1]) instanceof Promise).toBe(true);
        });

        it('should $.getScript', function() {
            spyOn($, 'getScript').and.returnValue(resolved);

            assetsManager.require([scriptFile1]);

            expect($.getScript).toHaveBeenCalledWith(scriptFile1);
        });

        it('should be reseted with #_reset', function() {
            expect(assetsManager._reset).toBeDefined();
        });

        it('should load only once', function() {
            spyOn($, 'getScript').and.returnValue(resolved);;

            assetsManager.require([scriptFile1, scriptFile1]);

            expect($.getScript.calls.count()).toEqual(1);
        });

        it('should resolve promise when the list is loaded', function(done) {
            assetsManager.require([scriptFile1])
                .then(function() {expect(true).toBe(true);})
                .then(done);

            simpleResponse(200, '{}', 'text/javascript');
        });

        it('should reject promise on error', function(done) {
            assetsManager.require([scriptFile1, scriptFile2])
                .then(function() {expect(false).toBe(true);})
                .catch(function() {
                    expect(true).toBe(true);
                    done();
                });

            jasmine.Ajax.requests.first().respondWith({
                "status": 200,
                "contentType": 'text/javascript',
            });
            simpleResponse(404);
        });
    });
});