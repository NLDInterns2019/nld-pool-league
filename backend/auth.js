const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

module.exports = {
  checkJwt: jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    aud: `https://${process.env.DOMAIN}/api/v2/`,
    issuer: `https://${process.env.DOMAIN}/`,
    algorithms: ["RS256"]
  })
};
