describe("Router", function() {
    'use strict';

    var initialHref = location.href;
    var initialTitle = $('title').text();

    describe('events', function() {
        beforeEach(function() {
            router.off();
        });

        afterEach(function() {
            history.pushState(null, initialTitle, initialHref);
        });

        function doClick(hash) {
            $('<a href="#'+hash+'">').appendTo('body').click().remove();
        }

        it('should have #on', function() {
            expect(router.on).toBeDefined();
        });

        it('should have #off', function() {
            expect(router.off).toBeDefined();
        });

        it('should trigger change event on popstate', function(done) {
            router.on('change', function() {
                expect(true).toBe(true);
                done();
            });

            history.pushState(null, 'initialTitle', initialHref+'#test');
            history.back();
        });

        it('should listen to clicks on links', function(done) {
            var expectedHash = 'test';
            router.on('change', function() {
                expect(location.hash.slice(1)).toBe(expectedHash);
                done();
            });

            doClick(expectedHash);
        });

        it('should listen to clicks on links', function(done) {
            var expectedAction = 'test';
            var expectedParam = 'param';
            var hash = expectedAction + '/' + expectedParam;
            router.on('change', function(_, action, params) {
                expect(action).toEqual(expectedAction);
                expect(params).toEqual([expectedParam]);
                done();
            });

            doClick(hash);
        });
    });
});
