const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

//Scheduler
const moment = require("moment-timezone");
const schedule = require("node-schedule");
const bookingsDB = require("./models/bookings");
const leaguesDB = require("./models/eight_nine_ball_leagues");
const fixturesDB = require("./models/eight_nine_ball_fixtures");

//Define routes
let eight_nine_ball_season = require("./routes/eight_nine_ball_seasons"),
  eight_nine_ball_leagues = require("./routes/eight_nine_ball_leagues"),
  eight_nine_ball_fixtures = require("./routes/eight_nine_ball_fixtures"),
  hall_of_fame = require("./routes/hall_of_fame"),
  bookings = require("./routes/bookings"),
  slack = require("./routes/slack"),
  kitty = require("./routes/kitty"),
  position_history = require("./routes/position_history");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/89ball_season", eight_nine_ball_season);
app.use("/api/89ball_league", eight_nine_ball_leagues);
app.use("/api/89ball_fixture", eight_nine_ball_fixtures);
app.use("/api/hall_of_fame", hall_of_fame);
app.use("/api/booking", bookings);
app.use("/api/slack", slack);
app.use("/api/kitty", kitty);
app.use("/api/position_history", position_history)

// Serve the static files from the production build of the client
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// RUN EVERY DAY AT 7 AM
schedule.scheduleJob(
  "Slack daily reminder",
  { hour: 7, minute: 0, dayOfWeek: [1, 2, 3, 4, 5] }, // UTC
  () => {
    /* start of the day */
    let start = moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate()
      .toISOString();

    /* end of the day */
    let end = moment(start)
      .add(1, "day")
      .toDate()
      .toISOString();

    bookingsDB
      .query()
      .whereBetween("start", [start, end]) // where the start of the event is during the day of posting
      .then(bookings => {
        let message = "";
        /* if there are bookings */
        if (bookings.length) {
          bookings.map(booking => {
            message = message.concat(
              booking.title.toLowerCase() +
                " at " +
                moment(booking.start)
                  .tz("Europe/London")
                  .format("HH:mm") +
                "\n"
            );
          });
        } else {
          message = "";
        }
        /* if there are fixtures on the day of posting, post the message, otherwise, don't */
        if (message !== "") {
          axios.post(
            "https://hooks.slack.com/services/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",
            {
              attachments: [
                {
                  mrkdwn_in: ["text"],
                  color: "#e23e4b",
                  pretext: "*Today's Fixtures:*",
                  text: message
                }
              ]
            }
          );
        }
      });
  }
);

// Send overdue fixtures reminder every monday at 7am after the fixture date
schedule.scheduleJob(
  "Overdue Fixtures Reminder",
  { hour: 7, minute: 0, dayOfWeek: 1 }, // UTC
  () => {
    fixturesDB
      .query()
      .where("date", "<", new Date().toISOString()) // where the fixture date is before the day of posting
      .where({ score1: null }) // where a score hasn't beem submitted (it is unplayed)
      .then(fixtures => {
        let eightBallMessage = ":8ball: *Eight Ball* :8ball:\n";
        let nineBallMessage = "\n:9ball: *Nine Ball* :9ball:\n";
        let finalMessage = "";
        /* if the query returns more than 0 rows */
        if (fixtures.length) {
          fixtures.map(fixture => {
            if (fixture.type === 8) {
              eightBallMessage = eightBallMessage.concat(
                fixture.player1 + " vs " + fixture.player2 + "\n"
              );
            } else if (fixture.type === 9) {
              nineBallMessage = nineBallMessage.concat(
                fixture.player1 + " vs " + fixture.player2 + "\n"
              );
            }
          });
          finalMessage = finalMessage.concat(
            eightBallMessage.concat(nineBallMessage)
          );
        } else {
          finalMessage = "";
        }

        /* if there are overdue fixtures, post the message, otherwise, don't */
        if (finalMessage !== "") {
          axios.post(
            "https://hooks.slack.com/services/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",
            {
              attachments: [
                {
                  mrkdwn_in: ["text"],
                  color: "#e23e4b",
                  pretext: "*Overdue Fixtures:*",
                  text: finalMessage
                }
              ]
            }
          );
        }
      });
  }
);

/* Outstanding payment reminder to post at 7am every monday */
schedule.scheduleJob(
  "Slack Payment Reminder",
  { hour: 7, minute: 0, dayOfWeek: 1 },
  () => {
    leaguesDB
      .query()
      .where({ paid: 0 }) // where a player hasn't paid
      .then(players => {
        let eightBallMessage = ":8ball: Eight Ball :8ball:\n";
        let nineBallMessage = "\n:9ball: Nine Ball :9ball:\n";
        let finalMessage = "";
        /* if the query returns more than 0 rows */
        if (players.length) {
          players.map(player => {
            if (player.type === 8) {
              eightBallMessage = eightBallMessage.concat(
                player.staffName + " : Season " + player.seasonId + "\n"
              );
            } else if (player.type === 9) {
              nineBallMessage = nineBallMessage.concat(
                player.staffName + " : Season " + player.seasonId + "\n"
              );
            }
          });
          finalMessage = finalMessage.concat(
            eightBallMessage.concat(nineBallMessage)
          );
        } else {
          finalMessage = "";
        }
        /* if there are outstanding payments, post message, otherwise, don't */
        if (finalMessage !== "") {
          axios.post(
            "https://hooks.slack.com/services/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",
            {
              attachments: [
                {
                  mrkdwn_in: ["text"],
                  color: "#e23e4b",
                  pretext: "*Outstanding Joining Fee Payments:*",
                  text: finalMessage
                }
              ]
            }
          );
        }
      });
  }
);

app.listen(PORT, () => {
  console.log("Express is listening on port: " + PORT);
});

// Export our app for testing purposes
module.exports = app;
