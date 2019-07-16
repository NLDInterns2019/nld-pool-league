var request = require("request");

module.exports = () => {
  var options = {
    method: "POST",
    url: "https://dev-q70ogh1b.eu.auth0.com/oauth/token",
    headers: { "content-type": "application/json" },
    body:
      '{"client_id":"90sFoptiMN30dXtcvbj0DY36DbVfukho","client_secret":"Z8PYwXm4FE7w1rWNBlSF1GDjjdtwb0RAkKZ1pZehhYBb3pXQWn_c8qRXmgw9h13R","audience":"https://dev-q70ogh1b.eu.auth0.com/api/v2/","grant_type":"client_credentials"}'
  };

  return new Promise(function(resolve, reject){
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body).access_token);
    });
  });
};
