### hapi-auth-jsonwebtoken

[![Build Status](https://travis-ci.org/boketto/hapi-auth-jsonwebtoken.svg?branch=master)](https://travis-ci.org/boketto/hapi-auth-jsonwebtoken)

JSON Web Token (JWT) authentication plugin for [Hapi 6.0](https://github.com/spumko/hapi) 

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

See the example for usage example. To run example:

> cd example
>
> npm install
>
> node .

```javascript

var privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    accounts = {
        123: {
          id: 123,
          user: 'john',
          name: 'John Doe',
          scope: ['a', 'b']
        }
    };

// validation function
var validate = function(token, decodedToken, cb) {

    /**
     * Here we can check if token is valid, i.e. if we're storing token in redis after user logged in:
     *
     * var isValid = false;
     * redis.get(token, function(err, val) {
     *  if (val) {
     *      isValid = true;
     *  }
     * });
     */

    var account = accounts[decodedToken.accountID];
    if (!account || !isValid) {
        return cb(null, false);
    }

    cb(err, isValid, account);
};

server.pack.register(require('hapi-auth-jsonwebtoken'), function (err) {

    server.auth.strategy('jwt', 'jwt', { key: privatekey,  validateFunc: validate });
    server.route({ method: 'GET', path: '/', config: { auth: 'jwt' } });
});
```
