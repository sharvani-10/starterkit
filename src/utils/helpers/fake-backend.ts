export { fakeBackend };

function fakeBackend() {
  let users = [
    {
      id: 1,
      username: 'info@wrappixel.com',
      password: 'admin123',
      firstName: 'Wrappixel',
      lastName: '.com',
      mobile: '9999999999'
    }
  ];

  const realFetch = window.fetch;

  window.fetch = function (url: any, opts: any) {
    return new Promise((resolve, reject) => {
      setTimeout(handleRoute, 500);

      function handleRoute() {
        switch (true) {
          case url.endsWith('/users/authenticate') && opts.method === 'POST':
            return authenticate();
          case url.endsWith('/users') && opts.method === 'GET':
            return getUsers();
          case url.endsWith('/users') && opts.method === 'POST':
            return addUser(); // legacy fallback
          case url.endsWith('/users/register') && opts.method === 'POST':
            return registerUser(); // new
          default:
            return realFetch(url, opts)
              .then((response) => resolve(response))
              .catch((error) => reject(error));
        }
      }

      // Route handlers
      function authenticate() {
        const { username, password } = body();
        const user = users.find((x) => x.username === username && x.password === password);

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
        newUser.firstName = newUser.firstName || '';
        newUser.lastName = newUser.lastName || '';
        newUser.mobile = newUser.mobile || '';
        users.push(newUser);
        return ok(newUser);
      }

      function registerUser() {
        const newUser = body();

        if (!newUser.username || !newUser.password || !newUser.mobile) {
          return error('Username, password, and mobile are required');
        }

        newUser.id = users.length + 1;
        newUser.firstName = newUser.firstName || '';
        newUser.lastName = newUser.lastName || '';

        users.push(newUser);
        return ok(newUser);
      }

      // Helper functions
      function ok(body: any) {
        resolve(
          new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        );
      }

      function unauthorized() {
        resolve(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          })
        );
      }

      function error(message: string) {
        resolve(
          new Response(JSON.stringify({ message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        );
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
