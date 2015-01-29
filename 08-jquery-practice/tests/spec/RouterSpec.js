describe("Router", function() {
    'use strict';

    var router = new Router();

    var initialHref = location.href;
    var initialTitle = $('title').text();

    function resetLocation() {
        history.pushState(null, initialTitle, initialHref);
    }

    describe('events', function() {
        beforeEach(function() {
            router.off();
            resetLocation();
        });

        afterEach(function() {
            resetLocation();
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

        it('should parse action from url', function() {
            var expectedAction = 'test';
            var action = router.parseUrl(expectedAction);

            expect(action.id).toEqual(expectedAction);
            expect($.isArray(action.params)).toBe(true);
            expect(action.params.length).toEqual(0);
        });

        it('should parse params from url', function() {
            var expectedAction = 'test';
            var expectedParam = 'param';
            var url = expectedAction + '/' + expectedParam;

            expect(router.parseUrl(url).params).toEqual([expectedParam]);
        });

        it('should trigger change event on popstate', function(done) {
            router.on('change', function() {
                expect(true).toBe(true);
                done();
            });

            history.pushState(null, initialTitle, initialHref+'#testBefore');
            history.pushState(null, initialTitle, initialHref+'#test');
            history.back();
        });

        describe('link clicks', function() {
            it('should listen to', function(done) {
                var expectedHash = 'test';
                router.on('change', function() {
                    expect(location.hash.slice(1)).toBe(expectedHash);
                    done();
                });

                doClick(expectedHash);
            });

            it('should handle additional params', function(done) {
                var expectedAction = 'test';
                var expectedParam = 'param';
                var hash = expectedAction + '/' + expectedParam;
                router.on('change', function(action, params) {
                    expect([action, params]).toEqual([expectedAction, [expectedParam]]);
                    done();
                });

                doClick(hash);
            });
        });

        describe('current action', function() {
            it('should set current action', function(done) {
                var expectedAction = 'test';
                var expectedParam = 'param';
                var hash = expectedAction + '/' + expectedParam;
                router.on('change', function(action, params) {
                    expect([action, params]).toEqual([router.getAction().id, router.getAction().params]);
                    done();
                });

                doClick(hash);
            });
        });

        describe('#go', function() {
            var expected = location.origin+'/#test/param';
            it('should push state', function() {
                spyOn(history, 'pushState');

                router.go(expected);

                expect(history.pushState.calls.mostRecent().args[2]).toEqual(expected);
            });

            it('should not fail, when there is no slash before #', function() {
                spyOn(history, 'pushState');

                router.go(expected.replace('/#', '#'));

                expect(history.pushState.calls.mostRecent().args[2]).toEqual(expected);
            });

            it('should not redirect outside origin', function() {
                spyOn(history, 'pushState');

                router.go('http://fake.com#test/param');

                expect(history.pushState.calls.mostRecent().args[2]).toEqual(expected);
            });
        });
    });
});
