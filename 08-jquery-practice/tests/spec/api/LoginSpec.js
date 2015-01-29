describe("Login", function() {
    'use strict';

    var client;
    beforeEach(function() {
        client = new DatingClient();
        client.sessionKey = 'testing';
        jasmine.Ajax.install();
    });

    afterEach(function() {
        client.logout();
        jasmine.Ajax.uninstall();
    });

    var credentials = {
        login: 'hello world',
        password: 'test'
    };
    it('should have #login', function() {
        expect(client.login).toBeDefined();
    });

    it('should require login and password', function() {
        var login = function() {
            client.login();
        };

        expect(login).toThrow();
    });

    it('should return promise', function() {
        expect(client.login(credentials) instanceof Promise).toBe(true);
    });

    it('should send request with credentials to /login', function() {
        client.login(credentials);

        expect(jasmine.Ajax.requests.mostRecent().url).toContain('/login');
        expect(jasmine.Ajax.requests.mostRecent().params).toBe($.param({data: credentials}));
    });

    it('should resolve with tocken if success', function(done) {
        var expectedToken = '123';
        client
            .login(credentials)
            .then(expectArgument(expectedToken))
            .then(done);

        simpleResponse(200, {
            status: 'it plays no role',
            token: expectedToken
        });
    });

    it('should be #isAuthorized after loged in', function(done) {
        expect(client.isAuthorized()).toBe(false);

        client
            .login(credentials)
            .then(function() {
                expect(client.isAuthorized()).toBe(true);
            })
            .then(done);

        simpleResponse(200, {
            status: 'it plays no role',
            token: 'token'
        });

    });

    it('should reject with errors on failure', function(done) {
        var expectedError = {message: 'Ooops, something wrong...', details: undefined};
        client
            .login(credentials)
            .catch(expectArgument(expectedError))
            .then(done);

        simpleResponse(403, {
            error: expectedError.message
        });
    });

    it('should #setToken', function() {
        client.setToken('test');

        expect(client.isAuthorized()).toBe(true);
    });

    it('should #getToken', function() {
        client.setToken('test');

        expect(client.getToken()).toBe('test');
    });

    it('should start session', function() {
        client.setToken('test');
        var client2 = new DatingClient();
        client2.sessionKey = client.sessionKey;

        expect(client.isAuthorized()).toBe(true);
    });

    it('should #logout', function() {
        client.setToken('test');

        client.logout();
        var client2 = new DatingClient();
        client2.sessionKey = client.sessionKey;

        expect(client.isAuthorized()).toBe(false);
    });
});
