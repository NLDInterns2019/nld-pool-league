var express = require("express");
var router = express.Router();
const auth = require("../auth");

const bookings = require("../models/bookings");

/* 
  GET handler for /api/bookings
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
  POST handler for /api/bookings/add
  Function: To add booking
*/
router.post("/add", auth.checkJwt, (req, res) => {
  const schema = {
    start: joi.date.iso().required(),
    end: joi.date.iso().required(),
    player1: Joi.string().required(),
    player2: Joi.string().required()
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
      player2: req.body.player2
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

module.exports = router;
