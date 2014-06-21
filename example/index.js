var Hapi = require('hapi'),
    jwt = require('jsonwebtoken'),
    server = Hapi.createServer('localhost', 8080, { cors: true });

var privateKey = 'YourApplicationsPrivateKey',
    accounts = {
        123: {
          id: 123,
          user: 'john',
          fullName: 'John Q Public'
        }
    },
    token = jwt.sign({ accountId: 123 }, privateKey);


var validate = function (token, decodedToken, callback) {

    console.log('Running validation...');
    console.log('token:', token); // should be your token
    console.log('decoded:', decodedToken);  // should be {accountId : 123}.

    if (decodedToken) {
      console.log(decodedToken.accountId.toString());
    }

    var account = accounts[decodedToken.accountId];
    if (!account) {
      return callback(null, false);
    }
    return callback(null, true, account)
};


server.pack.register(require('hapi-auth-jsonwebtoken'), function(err) {

    server.auth.strategy('jwt', 'jwt', { key: privateKey,  validateFunc: validate });

    server.route({
      method: 'GET',
      path: '/tokenRequired',
      config: { auth: 'jwt' },
      handler: function(request, reply) {
        reply({
            text: 'I am a JSON response, and you needed a token to get me.',
            credentials: request.auth.credentials
        });
      }
    });

    server.route({
      method: "GET",
      path: "/noTokenRequired",
      config: { auth: false },
      handler: function(request, reply) {
        reply({
            text: 'I am a JSON response, but you did not need a token to get me'
        });
      }
    });

});

server.start(function() {
    console.log(
            "Your token: " + token + "\n\n" +
            "No token required url: " + server.info.uri + "/noTokenRequired \n" +
            "Token required url: " + server.info.uri + "/tokenRequired \n\n" +
            "You must set headers [Authorization: Bearer " + token + "] to access second url"
    );
});