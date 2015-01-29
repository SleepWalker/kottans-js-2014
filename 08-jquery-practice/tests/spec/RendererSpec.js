describe("Renderer", function() {
    'use strict';

    var tpl = 'foo{{bar}}';
    var tplInput = {
        bar: 'bar'
    };
    var expectedOutput = 'foobar';
    var renderer = new Renderer();

    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe('#getTemplate', function() {
        it('should return promise', function() {
            expect(renderer.getTemplate() instanceof Promise).toBe(true);
        });

        it('should resolve with compiled template', function(done) {
            renderer.getTemplate('test')
                .then(function(template) {
                    expect($.isFunction(template)).toBe(true);
                })
                .then(done)
                ;

            simpleResponse(200, tpl);
        });

        it('the compiled template should be renderable', function(done) {
            renderer.getTemplate('test')
                .then(function(template) {
                    expect(template(tplInput)).toEqual(expectedOutput);
                })
                .then(done)
                ;

            simpleResponse(200, tpl);
        });
    });

    describe('#appendTo', function() {
        it('should return function', function() {
            expect($.isFunction(renderer.appendTo())).toBe(true);
        });

        describe('curried function', function() {
            var container;
            var curriedAppendTo;

            beforeEach(function() {
                container = $('<div>');
                curriedAppendTo = renderer.appendTo(container);
            });

            it('should accept string', function() {
                curriedAppendTo(expectedOutput);

                expect(container.html()).toEqual(expectedOutput);
            });

            it('should accept arrays', function() {
                curriedAppendTo([expectedOutput, expectedOutput]);

                expect(container.html()).toEqual(expectedOutput+expectedOutput);
            });

            it('should accept selector as destination', function() {
                container[0].id = 'test';
                $('body').append(container);
                curriedAppendTo = renderer.appendTo('#'+container[0].id);

                curriedAppendTo(expectedOutput);

                expect(container.html()).toEqual(expectedOutput);

                container.detach();
            });
        });
    });

    describe('#empty', function() {
        var $div;
        var curry;

        beforeEach(function() {
            $div = $('<div>').html('hello world');
            curry = renderer.empty($div);
        });

        it('should empty selector only on the second call', function() {
            expect($div.html().length > 0).toBe(true);

            curry();

            expect($div.html().length > 0).toBe(false);
        });

        it('should return first argument of curry function', function() {
            var expected = 'to return this';

            expect(curry(expected)).toEqual(expected);
        });
    });
});
