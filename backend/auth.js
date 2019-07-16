const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

module.exports = {
  checkJwt: jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dev-q70ogh1b.eu.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: "33YrQE03f8FWXKFzLl9RXvKj1XszVCab",
    issuer: `https://dev-q70ogh1b.eu.auth0.com/`,
    algorithms: ["RS256"]
  })
};
