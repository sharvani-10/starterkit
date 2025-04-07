export { fakeBackend };

function fakeBackend() {
    let users = [
        { id: 1, username: 'info@wrappixel.com', password: 'admin123', firstName: 'Wrappixel', lastName: '.com' }
    ];
    let realFetch = window.fetch;

    window.fetch = function (url: any, opts: any) {
        return new Promise((resolve: any, reject) => {
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && opts.method === 'POST':
                        return authenticate();
                    case url.endsWith('/users') && opts.method === 'GET':
                        return getUsers();
                    case url.endsWith('/users') && opts.method === 'POST':
                        return addUser();
                    default:
                        return realFetch(url, opts)
                            .then((response) => resolve(response))
                            .catch((error) => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body();
                const user: any = users.find((x) => x.username === username && x.password === password);

                if (!user) return error('Username or password is incorrect');

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                });
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users);
            }

            function addUser() {
                const newUser = body();
                newUser.id = users.length + 1;
                users.push(newUser);
                return ok(newUser);
            }

            // helper functions

            function ok(body: any) {
                resolve({
                    ok: true,
                    json: () => Promise.resolve(body)
                });
            }

            function unauthorized() {
                resolve({
                    status: 401,
                    json: () => Promise.resolve({ message: 'Unauthorized' })
                });
            }

            function error(message: string) {
                resolve({
                    status: 400,
                    json: () => Promise.resolve({ message })
                });
            }

            function isAuthenticated() {
                return opts.headers['Authorization'] === 'Bearer fake-jwt-token';
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }
        });
    };
}
