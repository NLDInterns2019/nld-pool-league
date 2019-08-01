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

module.exports = router;
