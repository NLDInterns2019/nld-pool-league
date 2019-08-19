const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

module.exports = {
  checkJwt: jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://nonlinear.eu.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    aud: "https://nonlinear.eu.auth0.com/api/v2/",
    issuer: `https://nonlinear.eu.auth0.com/`,
    algorithms: ["RS256"]
  })
};
