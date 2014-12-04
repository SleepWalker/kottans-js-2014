describe("Request", function() {
    'use strict';

    var client = new DatingClient();
    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe('GET', function() {
        it('should have #_get', function() {
            expect(client._get).toBeDefined();
        });

        it('should call _apiRequest', function() {
            spyOn(client, "_apiRequest");

            client._post('_get');

            expect(client._apiRequest).toHaveBeenCalled();
        });

        it('should do request', function() {
            client._get('login');

            expect(jasmine.Ajax.requests.mostRecent().url).toContain('/login');
            expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
        });
    });

    describe('POST', function() {
        it('should have #_post', function() {
            expect(client._post).toBeDefined();
        });

        it('should call _apiRequest', function() {
            spyOn(client, "_apiRequest");

            client._post('login');

            expect(client._apiRequest).toHaveBeenCalled();
        });

        it('should do request', function() {
            client._post('login');

            expect(jasmine.Ajax.requests.mostRecent().url).toContain('/login');
            expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
        });
    });

    describe('base', function() {
        it('should accept data', function() {
            var data = {foo: 'bar'};
            client._apiRequest('post', 'login', data);

            expect(jasmine.Ajax.requests.mostRecent().params).toBe($.param({data: data}));
        });

        it('should return promise', function() {
            expect(client._apiRequest('get', 'login') instanceof Promise).toBe(true);
        });

        var expectedResp = {foo: 'bar'};
        it('should resolve promise on success', function(done) {
            client
                ._apiRequest('get', 'login')
                .then(expectArgument(expectedResp))
                .then(done);

            simpleResponse(200, expectedResp);
        });

        it('should reject on error', function(done) {
            client
                ._apiRequest('get', 'login')
                .catch(expectArgument(expectedResp))
                .then(done);

            simpleResponse(403, expectedResp);
        });
    });

    describe('base', function() {
        it('should send SECRET-TOKEN header if has token', function(done) {
            var expectedToken = 'kottans';
            client._token = expectedToken;

            client
                ._apiRequest('get', 'login')
                .then(function() {
                    expect(jasmine.Ajax.requests.mostRecent().requestHeaders['SECRET-TOKEN']).toEqual(expectedToken);
                })
                .then(done);

            simpleResponse(200, '');
        });
    });
});
