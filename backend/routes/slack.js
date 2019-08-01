var express = require("express");
var router = express.Router();
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");
const moment = require("moment");

const { WebClient } = require("@slack/web-api");

const token = process.env.token;
const channel = process.env.channel;
const web = new WebClient(token);

/*  Slack message colours: 
    Booking Created: #36a64f (green)
    Result Submitted: #ff9c33 (orange)
    Reminder: #e23e4b (red)
    Season Created: #22d7e0 (blue)
*/

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

  var date = moment(req.body.start).format("DD-MMM-YYYY");
  var time = moment(req.body.start).format("HH:mm");

  const response = await web.chat.postMessage({
    channel: channel,
    attachments: [
      {
        /* post a message saying 'new emoji booking: PLAYER1 X - X PLAYER2 on DD/MM/YYYY at hh:mm' */
        mrkdwn_in: ["text"],
        color: "#36a64f",
        pretext:
          (req.body.type === 8
            ? ":8ball:"
            : req.body.type === 9
            ? ":9ball:"
            : "TYPE ERROR") + " Booking created:",
        text:
          req.body.player1 +
          " vs " +
          req.body.player2 +
          "  on " +
          date +
          " at " +
          time
      }
    ]
  });

  if (response) {
    res.json(response);
  } else {
    res.status(400).send;
  }
});

/* 
  POST handler for /api/slack/booking/reminder
  Function: To send new booking message
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

  let time = moment(req.body.start).format("HH:mm");
  let fifteenMinsBefore = moment(req.body.start)
    .subtract(15, "minutes")
    .unix();

  if (moment() > moment(fifteenMinsBefore)) {
    res.status(204).send();
    return;
  }
  const response = await web.chat.scheduleMessage({
    channel: channel,
    post_at: fifteenMinsBefore,
    attachments: [
      {
        mrkdwn_in: ["text"],
        color: "#e23e4b",
        pretext:
          (req.body.type === 8
            ? ":8ball:"
            : req.body.type === 9
            ? ":9ball:"
            : "TYPE ERROR") + " Reminder: \n",
        text: req.body.player1 + " vs " + req.body.player2 + " at " + time
      }
    ]
  });

  if (response) {
    res.json(response);
  } else {
    res.status(400).send;
  }
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

  const response = await web.chat.postMessage({
    channel: channel,
    attachments: [
      {
        mrkdwn_in: ["text"],
        color: "#22d7e0",
        pretext:
          (req.body.type === 8
            ? ":8ball:"
            : req.body.type === 9
            ? ":9ball:"
            : "TYPE ERROR") + " Season created:",
        text: "Season " + req.body.seasonName
      }
    ]
  });

  console.log(response);

  if (response) {
    res.json(response);
  } else {
    res.status(400).send;
  }
});

/* 
  POST handler for /api/slack/resultSubmitted
  Function: To send new season message
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

  const response = await web.chat.postMessage({
    channel: channel,
    /* post a message saying 'emoji PLAYER1 X - X PLAYER2' */
    attachments: [
      {
        mrkdwn_in: ["text"],
        color: "#ff9c33",
        pretext:
          (req.body.type === 8
            ? ":8ball:"
            : req.body.type === 9
            ? ":9ball:"
            : "TYPE ERROR") + " Result:",
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
  });

  console.log(response);

  if (response) {
    res.json(response);
  } else {
    res.status(400).send;
  }
});

module.exports = router;
