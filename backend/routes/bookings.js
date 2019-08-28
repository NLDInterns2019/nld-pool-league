var express = require("express");
var router = express.Router();
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");
const moment = require("moment");

const bookings = require("../models/bookings");

/* 
  GET handler for /api/booking
  Function: To get all the bookings
*/
router.get("/", (req, res) => {
  let where1 = {};
  let where2 = {};

  if (req.query.hasOwnProperty("staffName") && req.query.staffName !== " ") {
    where1.player1 = req.query.staffName;
    where2.player2 = req.query.staffName;
  }

  if (req.query.hasOwnProperty("type") && req.query.type !== "") {
    where1.type = parseInt(req.query.type);
    where2.type = parseInt(req.query.type);
  }

  bookings
    .query()
    .where(where1)
    .orWhere(where2)
    .orderBy("start")
    .then(
      bookings => {
        res.json(bookings);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/booking/upcoming
  Function: To get all the upcoming bookings
*/
router.get("/upcoming", (req, res) => {
  let where1 = {};
  let where2 = {};

  if (req.query.hasOwnProperty("staffName") && req.query.staffName !== " ") {
    where1.player1 = req.query.staffName;
    where2.player2 = req.query.staffName;
  }

  if (req.query.hasOwnProperty("type") && req.query.type !== "") {
    where1.type = parseInt(req.query.type);
    where2.type = parseInt(req.query.type);
  }

  bookings
    .query()
    .where(where1)
    .andWhereBetween("start", [
      moment()
        .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
        .toDate()
        .toISOString(),
      moment()
        .add(1, "week")
        .toDate()
        .toISOString()
    ]) //Only fetch the upcoming one week
    .orWhere(where2)
    .andWhereBetween("start", [
      moment()
        .toDate()
        .toISOString(),
      moment()
        .add(1, "week")
        .toDate()
        .toISOString()
    ]) //Only fetch the upcoming one week
    .orderBy("start")
    .then(
      bookings => {
        res.json(bookings);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  POST handler for /api/booking/add
  Function: To add booking
*/
router.post("/add", auth.checkJwt, (req, res) => {
  req.body.start = moment(req.body.start).toISOString();
  req.body.end = moment(req.body.end).toISOString();
  const schema = {
    start: Joi.string(),
    end: Joi.string(),
    type: Joi.number(),
    player1: Joi.string().required(),
    player2: Joi.string().required(),
    title: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  knex("bookings")
    .returning("id")
    .insert({
      start: req.body.start,
      end: req.body.end,
      type: req.body.type,
      player1: req.body.player1,
      player2: req.body.player2,
      title: req.body.title
    })
    .then(
      player => {
        res.json(player);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  PUT handler for /api/booking/add
  Function: To add booking
*/
router.put("/add/message_id", auth.checkJwt, (req, res) => {
  const schema = {
    id: Joi.number().required(),
    messageId: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  bookings
    .query()
    .where({ id: req.body.id })
    .patch({ messageId: req.body.messageId })
    .then(
      result => {
        if (res === 0) {
          res.status(404).send();
        }
        res.json(result);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  PUT handler for /api/booking/edit
  Function: To edit the booking
*/
router.put("/edit", auth.checkJwt, (req, res) => {
  const schema = {
    id: Joi.number().required(),
    messageId: Joi.string(),
    start: Joi.string().required(),
    end: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let patch = {
    start: req.body.start,
    end: req.body.end
  };

  if (req.body.hasOwnProperty("messageId") && req.body.messageId) {
    patch.messageId = req.body.messageId;
  }

  bookings
    .query()
    .where({ id: req.body.id })
    .patch(patch)
    .then(
      result => {
        if (res === 0) {
          res.status(404).send();
        }
        res.json(result);
      },
      e => {
        res.status(400).send(e);
      }
    );
});

/* 
  DELETE handler for /api/booking/delete
  Function: To delete booking
*/
router.delete("/delete", auth.checkJwt, (req, res) => {
  const schema = {
    id: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  bookings
    .query()
    .delete()
    .where({ id: req.body.id })
    .then(
      result => {
        if (result === 0) {
          //Nothing deleted
          res.status(404).json();
        } else {
          //Something deleted
          res.status(204).send();
        }
      },
      e => {
        //Internal error
        res.status(500).send();
      }
    );
});
module.exports = router;
