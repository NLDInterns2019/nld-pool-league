const moment = require("moment-timezone");
const schedule = require("node-schedule");
const bookingsDB = require("../models/bookings");
const leaguesDB = require("../models/eight_nine_ball_leagues");
const fixturesDB = require("../models/eight_nine_ball_fixtures");

const axios = require("axios");

module.exports = {
    todayBookings: schedule.scheduleJob(
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
      ),

      overdueFixtures: schedule.scheduleJob(
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
      ),

      outstandingPayments: schedule.scheduleJob(
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
      )
}