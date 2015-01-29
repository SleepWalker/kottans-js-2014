describe('AjaxLoader', function() {
    'use strict';

    var assetsManager;

    // TODO: support of css, images and text

    var scriptFile1 = 'fake1.js';
    var scriptFile2 = 'fake2.js';
    var resolved = new Promise(function(resolve) {resolve({status: 200});});

    beforeEach(function() {
        assetsManager = new AssetsManager();
        assetsManager._reset();

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe('#require', function() {
        it('should be defined in namespace', function() {
            expect(assetsManager.require).toBeDefined();
        });
        it('should be defined globally', function() {
            expect(require).toBeDefined();
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

        it('should load only once', function() {
            spyOn($, 'getScript').and.returnValue(resolved);

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
                'status': 200,
                'contentType': 'text/javascript',
            });
            simpleResponse(404);
        });
    });

    describe('#module', function() {
        it('should be defined', function() {
            expect(module).toBeDefined();
        });

        it('should return object with #requires method', function() {
            expect(module().requires).toBeDefined();
        });

        it('should return object with #exports method', function() {
            expect(module().exports).toBeDefined();
        });

        describe('#require', function() {
            it('should return array with modules if any defined', function(done) {
                var testModule = {
                    foo: 'bar',
                };

                require(['test']).then(function(modules) {
                    expect(modules[0]).toEqual(testModule);
                    done();
                });

                simpleResponse(200, 'module().exports(function() {return {foo: \'bar\'};});', 'text/javascript');
            });

            it('should return modules in correct order', function(done) {
                var testModule1 = {
                    foo1: 'bar',
                };
                var testModule2 = {
                    foo2: 'bar',
                };

                require(['test1', 'test2']).then(function(modules) {
                    expect(modules[0]).toEqual(testModule1);
                    expect(modules[1]).toEqual(testModule2);
                    done();
                });

                simpleResponse(200, 'module().exports(function() {return {foo2: \'bar\'};});', 'text/javascript');
                jasmine.Ajax.requests.first().respondWith({
                    'status': 200,
                    'contentType': 'text/javascript',
                    'responseText': 'module().exports(function() {return {foo1: \'bar\'};});'
                });
            });

            it('should return existed module without reloading it', function(done) {
                var testModule1 = {
                    foo1: 'bar',
                };
                var testModule2 = {
                    foo2: 'bar',
                };

                require(['test1']);
                simpleResponse(200, 'module().exports(function() {return {foo1: \'bar\'};});', 'text/javascript');

                require(['test1', 'test2']).then(function(modules) {
                    expect(modules[0]).toEqual(testModule1);
                    expect(modules[1]).toEqual(testModule2);
                    done();
                });
                simpleResponse(200, 'module().exports(function() {return {foo2: \'bar\'};});', 'text/javascript');
            });
        });

        describe('#module().requires', function() {
            it('should call #require()', function() {
                spyOn(window, 'require');
                var arg = [];

                module().requires(arg);

                expect(window.require).toHaveBeenCalledWith(arg);
            });

            it('should return object with #exports() method', function() {
                spyOn(window, 'require');
                expect(module().requires([]).exports).toBeDefined();
            });
        });

        describe('#module().exports', function() {
            it('should throw if first arg is not function', function() {
                var test = function() {
                    module().exports({});
                };

                expect(test).toThrow();
            });

            it('should call callback', function() {
                var callback = jasmine.createSpy('callback');

                module().exports(callback);

                expect(callback).toHaveBeenCalled();
            });
        });

        describe('#module().requires().exports()', function() {
            it('should call callback with required modules', function(done) {
                var callback = jasmine.createSpy('callback');
                module().requires(['test']).exports(function() {
                    expect(arguments.length).toEqual(1);
                    callback();
                    done();
                });

                expect(callback).not.toHaveBeenCalled();
                simpleResponse(200, '{}', 'text/javascript');
            });
        });
    });
});