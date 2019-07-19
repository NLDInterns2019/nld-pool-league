var express = require("express");
var router = express.Router();
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");

const bookings = require("../models/bookings");

/* 
  GET handler for /api/booking
  Function: To get all the bookings
*/
router.get("/", (req, res) => {
  bookings.query().then(
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
  req.body.start = new Date(req.body.start);
  req.body.end = new Date(req.body.end);
  const schema = {
    start: Joi.date()
      .iso()
      .required(),
    end: Joi.date()
      .iso()
      .required(),
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
    .insert({
      start: req.body.start,
      end: req.body.end,
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
