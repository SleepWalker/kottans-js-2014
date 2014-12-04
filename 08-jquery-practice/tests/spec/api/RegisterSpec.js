describe("Register", function() {
    'use strict';

    var client = new DatingClient();
    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    var credentials = {
        login: 'hello world',
        password: 'test',
        passwordConfirmation: 'test'
    };
    it('should have #register', function() {
        expect(client.register).toBeDefined();
    });

    it('should require login, password and passwordConfirmation', function() {
        var register = function() {
            client.register();
        };

        expect(register).toThrow();
    });

    it('should return promise', function() {
        expect(client.register(credentials) instanceof Promise).toBe(true);
    });

    it('should send request with credentials to /signup', function() {
        client.register(credentials);

        expect(jasmine.Ajax.requests.mostRecent().url).toContain('/signup');
        expect(jasmine.Ajax.requests.mostRecent().params).toBe($.param({data: credentials}));
    });

    it('should resolve with tocken if success', function(done) {
        var expectedToken = '123';
        client
            .register(credentials)
            .then(expectArgument(expectedToken))
            .then(done);

        simpleResponse(200, {
            status: 'it plays no role',
            token: expectedToken
        });
    });

    it('should reject with errors on failure', function(done) {
        var expectedError = {
            errorMessage: undefined,
            errorDetails: {
                login: 'bad login',
                password: 'where is your password?'
            }
        };
        client
            .register(credentials)
            .catch(expectArgument(expectedError))
            .then(done);

        simpleResponse(422, {
            errors: [{
                login: expectedError.errorDetails.login
            }, {
                password: expectedError.errorDetails.password
            }]
        });
    });
});
