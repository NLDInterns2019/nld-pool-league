var request = require("request");

module.exports = () => {
  var options = {
    method: "POST",
    url: `https://${process.env.DOMAIN}/oauth/token`,
    headers: { "content-type": "application/json" },
    body: `{"client_id":"${process.env.CLIENT_ID}", "client_secret":"${process.env.CLIENT_SECRET}", "audience":"https://${process.env.DOMAIN}/api/v2/", "grant_type":"client_credentials"}`
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body).access_token);
    });
  });
};
