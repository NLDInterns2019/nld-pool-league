const { WebClient } = require("@slack/web-api");

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);

const channel = "CLB0QN8JY";

(async () => {
  // Use the `auth.test` method to find information about the installing user
  const res = await web.auth.test();

  // Find your user id to know where to send messages to
  const userId = res.user_id;

  // Use the `chat.postMessage` method to send a message from this app
  await web.chat.postMessage({
    channel: channel,
    text: `TEST MESSAGE`
  });

  console.log("Message posted!");
})();
