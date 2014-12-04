describe("User", function() {
    'use strict';

    var client;
    beforeEach(function() {
        client = new DatingClient();
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe('List', function() {
        it('should have #getUsers', function() {
            expect(client.getUsers).toBeDefined();
        });

        it('should request users with #_get', function() {
            spyOn(client, "_get");

            client.getUsers();

            expect(client._get).toHaveBeenCalledWith('users');
        });

        it('should return promise', function() {
            expect(client.getUsers() instanceof Promise).toBe(true);
        });
    });

    describe('Find', function() {
        it('should have #getUser', function() {
            expect(client.getUser).toBeDefined();
        });

        it('should fail without token', function() {
            var user = function() {
                client.getUser();
            };

            expect(user).toThrow();
        });

        describe('with token', function() {
            beforeEach(function() {
                client._token = 'kottans';
            });

            it('should require arguments', function() {
                var user = function() {
                    client.getUser();
                };

                expect(user).toThrow();
            });

            it('should return promise', function() {
                expect(client.getUser(1) instanceof Promise).toBe(true);
            });

            it('should do request to /user/:id with #_get', function() {
                spyOn(client, "_get");
                var expected = 1;

                client.getUser(expected);

                expect(client._get).toHaveBeenCalledWith('user/' + expected);
            });
        });
    });
});
