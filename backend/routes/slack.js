var express = require("express");
var router = express.Router();
const Joi = require("joi");
const auth = require("../auth");
const moment = require("moment-timezone");

const { WebClient } = require("@slack/web-api");

const token = process.env.token;
const channel = process.env.channel;
const web = new WebClient(token);

const colours = {
  bookings: "#36a64f", // green
  results: "#ff9c33", // orange
  reminders: "#e23e4b", // red
  seasons: "#1fbfb7", // blue
  kitty: "#8532a8" // purple
};

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
            req.body.player1 +
            " vs " +
            req.body.player2 +
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

  let time = moment(req.body.start)
    .tz("Europe/London")
    .format("HH:mm");
  let fifteenMinsBefore = moment(req.body.start)
    .subtract(15, "minutes")
    .unix();

  if (moment() > moment(req.body.start).subtract(15, "minutes")) {
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
          text: req.body.player1 + " vs " + req.body.player2 + " at " + time
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
    players: Joi.string().required(),
    score1: Joi.number().required(),
    score2: Joi.number().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

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
              : "TYPE ERROR") + " *Result:*",
          text:
            req.body.players.split(" ")[0] +
            "  " +
            req.body.score1 +
            "  -  " +
            req.body.score2 +
            "  " +
            req.body.players.split(" ")[1]
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
  POST handler for /api/slack/showTable
  Function: To send league table message
*/
router.post("/showTable", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number().required(),
    seasonId: Joi.number().required(),
    table: Joi.string().required()
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
            " League Table:*",
          text: "```" + req.body.table + "```"
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
  POST handler for /api/slack/showTableCommand
  Function: league table slash command (/table type season_id)
*/
router.post("/showTableCommand", async (req, res) => {
  //let text = req.body.text;
  //let requestBody = req.body;
  let split = req.body.text.split("+");

  const type = split[0];
  const seasonId = split[1];

  const response = {
    response_type: "in_channel", // public to the channel
    attachments: [
      {
        mrkdwn_in: ["text"],
        color: colours.seasons,
        pretext:
          (type === 8 ? ":8ball:" : type === 9 ? ":9ball:" : "TYPE ERROR") +
          "* Season " +
          seasonId +
          " League Table:*",
        text: "Table goes here"
      }
    ]
  };

  res.json(response);

  // const response = await web.chat
  //   .postMessage({
  //     channel: channel,
  //     attachments: [
  //       {
  //         mrkdwn_in: ["text"],
  //         color: colours.seasons,
  //         // pretext:
  //         // (req.query.text.split("+")[0] === 8
  //         //   ? ":8ball:"
  //         //   : req.query.text.split("+")[0] === 9
  //         //   ? ":9ball:"
  //         //   : "TYPE ERROR") +
  //         // "* Season " +
  //         // req.query.text.split("+")[1] +
  //         // " League Table:*",
  //         //text: "```" + req.query.table + "```"
  //         text: "Table goes here"
  //       }
  //     ]
  //   })
  //   .then(
  //     response => {
  //       res.status(200).json(response);
  //     },
  //     e => {
  //       res.status(400).send(e);
  //     }
  //   );
});

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
              : "TYPE ERROR") + "* Season Closed:*",
          text: "Season " + req.body.seasonId
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

module.exports = router;
