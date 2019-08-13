var express = require("express");
var router = express.Router();
const Joi = require("joi");
const auth = require("../auth");
const moment = require("moment-timezone");
const cTable = require("console.table");
const axios = require("axios");
const _ = require("lodash");

var getToken = require("../test/function/token");
const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const bookingsDB = require("../models/bookings");

const { WebClient } = require("@slack/web-api");

const token = process.env.token;
const channel = process.env.channel;
const web = new WebClient(token);

const colours = {
  bookings: "#36a64f", // green
  results: "#ff9c33", // orange
  reminders: "#e23e4b", // red
  seasons: "#1fbfb7", // blue
  kitty: "#8532a8", // purple
  info: "#fcba03" // yellow
};

/* create a league table string from an array of players */
function createConsoleTable(players) {
  var values = [];
  for (var i = 0; i < players.length; i++) {
    values.push([
      i + 1,
      players[i].staffName,
      players[i].play,
      players[i].win,
      players[i].draw,
      players[i].lose,
      players[i].goalsFor,
      players[i].goalsAgainst,
      players[i].points
    ]);
  }

  const table = cTable.getTable(
    ["Pos", "Name", "P", "W", "D", "L", "F", "A", "Pts"],
    values
  );

  return table;
}

function getLeagueTable(type, seasonId) {
  return eight_nine_ball_leagues
    .query()
    .where({
      type: parseInt(type),
      seasonId: parseInt(seasonId)
    })
    .orderBy("points", "desc")
    .orderBy("goalsFor", "desc")
    .orderBy("goalsAgainst", "asc")
    .orderBy("win", "desc");
}

/* 
  POST handler for /api/slack/booking
  Function: To send new booking message
*/
router.post("/booking", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    player1: Joi.string().required(),
    player2: Joi.string().required(),
    start: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let playersdb = [];

  await getToken().then(
    async result => {
      await axios
        .get("https://dev-q70ogh1b.eu.auth0.com/api/v2/users", {
          params: {
            search_engine: "v3"
          },
          headers: { Authorization: `Bearer ${result}` }
        })
        .then(players => {
          playersdb = players.data;
        });
    },
    e => {
      res.status(400).send(e);
      return;
    }
  );

  const player1 = _.find(playersdb, { nickname: req.body.player1 });
  const player2 = _.find(playersdb, { nickname: req.body.player2 });
  //Use the slackId if exist, otherwise use the nickname
  const player1SlackId = player1.hasOwnProperty("user_metadata")
    ? player1.user_metadata.slackId
    : player1.nickname;
  const player2SlackId = player2.hasOwnProperty("user_metadata")
    ? player2.user_metadata.slackId
    : player2.nickname;

  var date = moment(req.body.start)
    .tz("Europe/London")
    .format("DD-MMM-YYYY");
  var time = moment(req.body.start)
    .tz("Europe/London")
    .format("HH:mm");

  await web.chat
    .postMessage({
      channel: channel,
      attachments: [
        {
          /* post a message saying 'new emoji booking: PLAYER1 X - X PLAYER2 on DD/MM/YYYY at hh:mm' */
          mrkdwn_in: ["text"],
          color: colours.bookings,
          pretext:
            (req.body.type === 8
              ? ":8ball:"
              : req.body.type === 9
              ? ":9ball:"
              : "TYPE ERROR") + " *Booking created:*",
          text:
            `<@${player1SlackId}>` +
            " vs " +
            `<@${player2SlackId}>` +
            " on " +
            date +
            " at " +
            time
        }
      ]
    })
    .then(
      response => {
        res.status(200).json(response);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  POST handler for /api/slack/booking/reminder
  Function: To send reminder 15 mins before scheduled fixture
*/
router.post("/booking/reminder", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    player1: Joi.string().required(),
    player2: Joi.string().required(),
    start: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  await getToken().then(
    async result => {
      await axios
        .get("https://dev-q70ogh1b.eu.auth0.com/api/v2/users", {
          params: {
            search_engine: "v3"
          },
          headers: { Authorization: `Bearer ${result}` }
        })
        .then(players => {
          playersdb = players.data;
        });
    },
    e => {
      res.status(400).send(e);
      return;
    }
  );

  const player1 = _.find(playersdb, { nickname: req.body.player1 });
  const player2 = _.find(playersdb, { nickname: req.body.player2 });
  //Use the slackId if exist, otherwise use the nickname
  const player1SlackId = player1.hasOwnProperty("user_metadata")
    ? player1.user_metadata.slackId
    : player1.nickname;
  const player2SlackId = player2.hasOwnProperty("user_metadata")
    ? player2.user_metadata.slackId
    : player2.nickname;

  let time = moment(req.body.start)
    .tz("Europe/London")
    .format("HH:mm");
  let fifteenMinsBefore = moment(req.body.start)
    .subtract(15, "minutes")
    .unix();

  if (moment() >= moment(req.body.start).subtract(15, "minutes")) {
    res.status(204).send();
    return;
  }
  await web.chat
    .scheduleMessage({
      channel: channel,
      post_at: fifteenMinsBefore,
      attachments: [
        {
          mrkdwn_in: ["text"],
          color: colours.reminders,
          pretext:
            (req.body.type === 8
              ? ":8ball:"
              : req.body.type === 9
              ? ":9ball:"
              : "TYPE ERROR") + " *Reminder:*",
          text:
            `<@${player1SlackId}>` +
            " vs " +
            `<@${player2SlackId}>` +
            " at " +
            time
        }
      ]
    })
    .then(
      response => {
        res.status(200).json(response);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  DELETE handler for /api/slack/booking/reminder
  Function: To delete scheduled reminder
*/
router.delete("/booking/reminder", auth.checkJwt, async (req, res) => {
  const schema = {
    messageId: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  await web.chat
    .deleteScheduledMessage({
      channel: channel,
      scheduled_message_id: req.body.messageId
    })
    .then(
      response => {
        res.status(200).json(response);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  POST handler for /api/slack/newSeason
  Function: To send new season message
*/
router.post("/newSeason", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  const response = await web.chat
    .postMessage({
      channel: channel,
      attachments: [
        {
          mrkdwn_in: ["text"],
          color: colours.seasons,
          pretext:
            (req.body.type === 8
              ? ":8ball:"
              : req.body.type === 9
              ? ":9ball:"
              : "TYPE ERROR") + " *Season created:*",
          text: "Season " + req.body.seasonName
        }
      ]
    })
    .then(
      response => {
        res.status(200).json(response);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  POST handler for /api/slack/resultSubmitted
  Function: To send score submitted message
*/
router.post("/resultSubmitted", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonId: Joi.number().required(),
    players: Joi.string().required(),
    score1: Joi.number().required(),
    score2: Joi.number().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  getLeagueTable(req.body.type, req.body.seasonId).then(async players => {
    const table = createConsoleTable(players);
    const response = await web.chat
      .postMessage({
        channel: channel,
        /* post a message saying 'emoji PLAYER1 X - X PLAYER2' */
        attachments: [
          {
            mrkdwn_in: ["text"],
            color: colours.results,
            pretext:
              (req.body.type === 8
                ? ":8ball:"
                : req.body.type === 9
                ? ":9ball:"
                : "TYPE ERROR") +
              " *Season " +
              req.body.seasonId +
              " Result:*",
            text:
              req.body.players.split(" ")[0] +
              "  " +
              req.body.score1 +
              "  -  " +
              req.body.score2 +
              "  " +
              req.body.players.split(" ")[1] +
              "\n\nUpdated League Table:\n```" +
              table +
              "```"
          }
        ]
      })
      .then(
        response => {
          res.status(200).json(response);
        },
        e => {
          res.status(400).send(e);
        }
      );
  });
});

/* 
  POST handler for /api/slack/resultEdited
  Function: To send score edited message
*/
router.post("/resultEdited", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonId: Joi.number().required(),
    players: Joi.string().required(),
    score1: Joi.number().required(),
    score2: Joi.number().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  getLeagueTable(req.body.type, req.body.seasonId).then(async players => {
    const table = createConsoleTable(players);
    const response = await web.chat
      .postMessage({
        channel: channel,
        /* post a message saying 'emoji PLAYER1 X - X PLAYER2' */
        attachments: [
          {
            mrkdwn_in: ["text"],
            color: colours.reminders,
            pretext:
              (req.body.type === 8
                ? ":8ball:"
                : req.body.type === 9
                ? ":9ball:"
                : "TYPE ERROR") +
              " *Season " +
              req.body.seasonId +
              " EDITED Result:*",
            text:
              req.body.players.split(" ")[0] +
              "  " +
              req.body.score1 +
              "  -  " +
              req.body.score2 +
              "  " +
              req.body.players.split(" ")[1] +
              "\n\nUpdated League Table:\n```" +
              table +
              "```"
          }
        ]
      })
      .then(
        response => {
          res.status(200).json(response);
        },
        e => {
          res.status(400).send(e);
        }
      );
  });
});

/* 
  POST handler for /api/slack/showTable
  Function: To send league table message
*/
// router.post("/showTable", auth.checkJwt, async (req, res) => {
//   const schema = {
//     type: Joi.number().required(),
//     seasonId: Joi.number().required()
//     //table: Joi.string().required()
//   };

//   //Validation
//   if (Joi.validate(req.body, schema, { convert: false }).error) {
//     res.status(400).json({ status: "error", error: "Invalid data" });
//     return;
//   }

//   getLeagueTable(req.body.type, req.body.seasonId).then(async players => {
//     const table = createConsoleTable(players);
//     const response = await web.chat
//       .postMessage({
//         channel: channel, // public to the channel
//         attachments: [
//           {
//             mrkdwn_in: ["text"],
//             color: colours.seasons,
//             pretext:
//               (req.body.type === 8
//                 ? ":8ball:"
//                 : req.body.type === 9
//                 ? ":9ball:"
//                 : "TYPE ERROR") +
//               "* Season " +
//               req.body.seasonId +
//               " League Table:*",
//             text: "```" + table + "```"
//           }
//         ]
//       })
//       .then(
//         response => {
//           res.status(200).json(response);
//         },
//         e => {
//           res.status(400).send(e);
//         }
//       );
//   });
// });

/* 
  POST handler for /api/slack/feePaid
  Function: To send fee paid message
*/
router.post("/feePaid", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonId: Joi.number().required(),
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  const response = await web.chat
    .postMessage({
      channel: channel,
      attachments: [
        {
          mrkdwn_in: ["text"],
          color: colours.kitty,
          pretext:
            (req.body.type === 8
              ? ":8ball:"
              : req.body.type === 9
              ? ":9ball:"
              : "TYPE ERROR") +
            "* Season " +
            req.body.seasonId +
            " Joining Fee Paid:*",
          text: req.body.staffName + " has paid"
        }
      ]
    })
    .then(
      response => {
        res.status(200).json(response);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  POST handler for /api/slack/playerRemoved
  Function: To send player removed message
*/
router.post("/playerRemoved", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonId: Joi.number().required(),
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  const response = await web.chat
    .postMessage({
      channel: channel,
      attachments: [
        {
          mrkdwn_in: ["text"],
          color: colours.seasons,
          pretext:
            (req.body.type === 8
              ? ":8ball:"
              : req.body.type === 9
              ? ":9ball:"
              : "TYPE ERROR") +
            "* Season " +
            req.body.seasonId +
            " Player Removed:*",
          text: req.body.staffName + " has been removed"
        }
      ]
    })
    .then(
      response => {
        res.status(200).json(response);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  POST handler for /api/slack/seasonClosed
  Function: To send season closed message
*/
router.post("/seasonClosed", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonId: Joi.number().required()
    //table: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  getLeagueTable(req.body.type, req.body.seasonId).then(async players => {
    const table = createConsoleTable(players);
    const response = await web.chat
      .postMessage({
        channel: channel,
        attachments: [
          {
            mrkdwn_in: ["text"],
            color: colours.seasons,
            pretext:
              (req.body.type === 8
                ? ":8ball:"
                : req.body.type === 9
                ? ":9ball:"
                : "TYPE ERROR") +
              "* Season " +
              req.body.seasonId +
              " Closed:*",
            text: "Final Standings: \n```" + table + "```"
          }
        ]
      })
      .then(
        response => {
          res.status(200).json(response);
        },
        e => {
          res.status(400).send(e);
        }
      );
  });
});

/* 
  POST handler for /api/slack/poolCommand
  Function: general pool league command (/pool function type season_id)
*/
router.post("/poolCommand", async (req, res) => {
  const text = req.body.text;
  const func = text.split(" ")[0];
  const type = text.split(" ")[1];
  const seasonId = text.split(" ")[2];
  const regex = /^[1-9]([0-9])*$/;

  // show the league table for given season
  if (func === "table" && text.split(" ").length === 3) {
    if (type !== "8" && type !== "9") {
      const response = {
        response_type: "in_channel",
        attachments: [
          {
            mrkdwn_in: ["text"],
            color: colours.info,
            pretext: "*Invalid type*",
            text: "The valid types are: `8` and `9`"
          }
        ]
      };
      res.json(response);
    } else if (!regex.test(seasonId)) {
      const response = {
        response_type: "in_channel",
        attachments: [
          {
            mrkdwn_in: ["text"],
            color: colours.info,
            pretext: "*Invalid season*",
            text: "Season has to be a number bigger than zero"
          }
        ]
      };
      res.json(response);
    } else {
      getLeagueTable(parseInt(type), parseInt(seasonId)).then(
        players => {
          if (!players.length) {
            const response = {
              response_type: "in_channel",
              text: "Nothing to show"
            };

            res.json(response);
          } else {
            const table = createConsoleTable(players);
            const response = {
              response_type: "in_channel", // public to the channel
              attachments: [
                {
                  mrkdwn_in: ["text"],
                  color: colours.seasons,
                  pretext:
                    (type === "8"
                      ? ":8ball:"
                      : type === "9"
                      ? ":9ball:"
                      : "TYPE ERROR") +
                    "* Season " +
                    seasonId +
                    " League Table:*",
                  text: "```" + table + "```"
                }
              ]
            };
            res.json(response);
          }
        },
        e => {
          res.status(400).json(e);
        }
      );
    }
  } else if (func === "today" && text.split(" ").length === 1) {
    let start = moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate()
      .toISOString();
    let end = moment(start)
      .add(1, "day")
      .toDate()
      .toISOString();

    bookingsDB
      .query()
      .whereBetween("start", [start, end])
      .then(bookings => {
        let message = "";
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
          message = "There are no matches scheduled for today";
        }
        const response = {
          response_type: "in_channel",
          attachments: [
            {
              mrkdwn_in: ["text"],
              color: colours.reminders,
              pretext: "*Today's Fixtures:*",
              text: message
            }
          ]
        };
        res.json(response);
      });
  } else if (func === "tomorrow" && text.split(" ").length === 1) {
    if (moment().day() === 5 || moment().day() === 6) {
      // if today is a Friday or Saturday, there can't be games tomorrow
      const response = {
        response_type: "in_channel",
        attachments: [
          {
            mrkdwn_in: ["text"],
            color: colours.info,
            pretext: "*Error*",
            text: "There are no games at the weekend"
          }
        ]
      };
      res.json(response);
    } else {
      let start = moment()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .add(1, "day")
        .toDate()
        .toISOString();
      let end = moment(start)
        .add(1, "day")
        .toDate()
        .toISOString();

      bookingsDB
        .query()
        .whereBetween("start", [start, end])
        .then(bookings => {
          let message = "";
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
            message = "There are no matches scheduled for tomorrow";
          }
          const response = {
            response_type: "in_channel",
            attachments: [
              {
                mrkdwn_in: ["text"],
                color: colours.reminders,
                pretext: "*Tomorrow's Fixtures:*",
                text: message
              }
            ]
          };
          res.json(response);
        });
    }
  } else {
    const response = {
      response_type: "in_channel",
      attachments: [
        {
          mrkdwn_in: ["text"],
          color: colours.info,
          pretext: "*Invalid function*",
          text:
            "*The valid functions are:*\n`/pool table type season_id`\n`/pool today`\n`/pool tomorrow`"
        }
      ]
    };
    res.json(response);
  }
});

module.exports = router;
