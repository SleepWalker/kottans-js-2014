describe('AjaxLoader', function() {
    'use strict';

    var ajaxLoader = new AjaxLoader();

    beforeEach(function() {
        ajaxLoader.reset();
        ajaxLoader.unregisterAllLoaders();
    });

    describe('#isBusy', function() {
        it('should have #isBusy', function() {
            expect(ajaxLoader.isBusy).toBeDefined();
        });

        it('should not be busy on load', function() {
            expect(ajaxLoader.isBusy()).toBe(false);
        });

        it('should be busy if #start called', function() {
            expect(ajaxLoader.start).toBeDefined();

            ajaxLoader.start();

            expect(ajaxLoader.isBusy()).toBe(true);
        });

        describe('#reset', function() {
            it('should be not busy if #reset called', function() {
                expect(ajaxLoader.reset).toBeDefined();

                ajaxLoader.start();
                ajaxLoader.reset();

                expect(ajaxLoader.isBusy()).toBe(false);
            });

            it('should empty whole queue on #reset', function() {
                ajaxLoader.start();
                ajaxLoader.start();

                ajaxLoader.reset();

                expect(ajaxLoader.isBusy()).toBe(false);
            });
        });

        describe('#stop', function() {
            it('should stop the last start with #stop', function() {
                expect(ajaxLoader.stop).toBeDefined();
                ajaxLoader.start();

                ajaxLoader.stop();
                expect(ajaxLoader.isBusy()).toBe(false);
            });

            it('should be busy if not all stopped', function() {
                expect(ajaxLoader.stop).toBeDefined();
                ajaxLoader.start();
                ajaxLoader.start();

                ajaxLoader.stop();
                expect(ajaxLoader.isBusy()).toBe(true);
            });
        });
    });

    describe('ajax', function() {
        it('should listen to jQuery ajaxSend', function() {
            $(document).trigger('ajaxSend');

            expect(ajaxLoader.isBusy()).toBe(true);
        });

        it('should listen to jQuery ajaxComplete', function() {
            ajaxLoader.start();

            $(document).trigger('ajaxComplete');

            expect(ajaxLoader.isBusy()).toBe(false);
        });
    });

    describe('#register', function() {
        it('should store references to loader elements with #registerLoader', function() {
            expect(ajaxLoader.registerLoader).toBeDefined();
        });
    });

    it('should return true when #hasLoader', function() {
        expect(ajaxLoader.hasLoader).toBeDefined();

        ajaxLoader.registerLoader(document.body);

        expect(ajaxLoader.hasLoader(document.body)).toBe(true);
    });

    describe('#unregisterLoader', function() {
        it('should #unregisterLoader', function() {
            expect(ajaxLoader.unregisterLoader).toBeDefined();
            ajaxLoader.registerLoader(document.body);

            ajaxLoader.unregisterLoader(document.body);

            expect(ajaxLoader.hasLoader(document.body)).toBe(false);
        });
    });

    describe('#unregisterAllLoaders', function() {
        it('should remove all loaders with #unregisterAllLoaders', function() {
            expect(ajaxLoader.unregisterAllLoaders).toBeDefined();

            ajaxLoader.registerLoader(document.body);
            ajaxLoader.registerLoader(document);

            ajaxLoader.unregisterAllLoaders();

            expect(ajaxLoader.hasLoader(document.body)).toBe(false);
            expect(ajaxLoader.hasLoader(document)).toBe(false);
        });
    });

    describe('.is-active', function() {
        it('should add class .is-active when loading', function() {
            ajaxLoader.registerLoader(document.body);

            ajaxLoader.start();

            expect($(document.body).hasClass('is-active')).toBe(true);
        });

        it('should add class .is-active to loader added while isBusy', function() {
            ajaxLoader.start();

            ajaxLoader.registerLoader(document.body);

            expect($(document.body).hasClass('is-active')).toBe(true);
        });

        describe('delayed remove', function() {
            beforeEach(function() {
                jasmine.clock().install();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should remove .is-active, when all requests ready after timeout', function() {
                ajaxLoader.registerLoader(document.body);

                ajaxLoader.start();
                ajaxLoader.stop();

                expect($(document.body).hasClass('is-active')).toBe(true);

                jasmine.clock().tick(ajaxLoader.transitionDelay + 1);

                expect($(document.body).hasClass('is-active')).toBe(false);
            });

            it('should not remove .is-active, when started a new task within timeout', function() {
                ajaxLoader.registerLoader(document.body);

                ajaxLoader.start();
                ajaxLoader.stop();

                ajaxLoader.start();

                jasmine.clock().tick(ajaxLoader.transitionDelay + 1);

                expect($(document.body).hasClass('is-active')).toBe(true);
            });
        });

        it('should remove .is-active class on unregister', function() {
            ajaxLoader.registerLoader(document.body);
            ajaxLoader.start();

            ajaxLoader.unregisterLoader(document.body);

            expect($(document.body).hasClass('is-active')).toBe(false);
        });

        it('should remove .is-active class on unregister all', function() {
            ajaxLoader.registerLoader(document.body);
            ajaxLoader.start();

            ajaxLoader.unregisterAllLoaders();

            expect($(document.body).hasClass('is-active')).toBe(false);
        });
    });

    describe('on progress', function() {
        beforeEach(function() {
            ajaxLoader.off('progress');
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('should return 100, when ajax request finished', function(done) {
            ajaxLoader.on('progress', function(progress) {
                expect(progress).toBe(100);

                done();
            });

            $(document).trigger('ajaxComplete');
        });

        it('should return 100, on failed request', function(done) {
            ajaxLoader.on('progress', function(progress) {
                expect(progress).toBe(100);

                done();
            });

            $(document).trigger('ajaxError');
        });

        it('should listen progress event', function() {
            spyOn(XMLHttpRequest.prototype, 'addEventListener');

            $(document).trigger('ajaxSend');

            $.get('kottans');

            var args = XMLHttpRequest.prototype.addEventListener.calls.mostRecent().args;

            expect(args[0]).toEqual('progress');
            expect($.isFunction(args[1])).toBe(true);
        });

        xit('should trigger progress event', function() {
            var stub = jasmine.createSpy('stub');

            spyOn(XMLHttpRequest.prototype, 'addEventListener');
            ajaxLoader.on('progress', stub);
        });
        xit('should calculate global progress of all runing requests');
    });
});