### hapi-auth-jsonwebtoken

[**hapi**](https://github.com/spumko/hapi) JSON Web Token (JWT) authentication plugin

Based on original version of [hapi-auth-jwt by ryanfitz](https://github.com/ryanfitz/hapi-auth-jwt), modified to work with Hapi 6.0, and return some additional data for validateFunc (original token).
The original token can be used for extra validation, i.e. check against redis to make sure token is valid.

JSON Web Token authentication requires verifying a signed token. The `'jwt'` scheme takes the following options:

- `key` - (required) The private key the token was signed with.
- `validateFunc` - (optional) validation and user lookup function with the signature `function(token, decodedToken, callback)` where:
    - `token` - original token from the request
    - `decodedToken` - the verified and decoded jwt token
    - `callback` - a callback function with the signature `function(err, isValid, credentials)` where:
        - `err` - an internal error.
        - `isValid` - `true` if the token was valid otherwise `false`.
        - `credentials` - a credentials object passed back to the application in `request.auth.credentials`. Typically, `credentials` are only
          included when `isValid` is `true`, but there are cases when the application needs to know who tried to authenticate even when it fails
          (e.g. with authentication mode `'try'`).

See the example folder for an executable example.

```javascript

var accounts = {
    123: {
      id: 123,
      user: 'john',
      name: 'John Doe',
      scope: ['a', 'b']
    }
};

var validate = function(token, decodedToken, callback) {

    var account = accounts[decodedToken.accountID];
    if (!account) {
        return callback(null, false);
    }

    callback(err, isValid, {id: account.id, name: account.name });
};

server.pack.register(require('hapi-auth-jwt'), function (err) {
    var privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc';

    server.auth.strategy('jwt', 'jwt', { key: privatekey,  validateFunc: validate });
    server.route({ method: 'GET', path: '/', config: { auth: 'jwt' } });
});
```
