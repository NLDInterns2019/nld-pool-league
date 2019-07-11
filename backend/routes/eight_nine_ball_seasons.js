var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");

/* 
  GET handler for /api/89ball_season
  Function: To get all the 8/9 ball seasons
*/
router.get("/", (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

    //Validation
    if (Joi.validate(req.body, schema, { convert: false }).error) {
      res.status(400).json({ status: "error", error: "Invalid data" });
      return;
    }

  eight_nine_ball_leagues
    .query()
    .where({type: req.body.type})
    .distinct("seasonId")
    .then(
      seasons => {
        res.json(seasons);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  DELETE handler for /api/89ball_season/delete/
  Function: To delete seasons (NOTE YET IMPLEMENTED IN THE UI)
*/
router.delete("/delete", (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_leagues
    .query()
    .delete()
    .where({type: req.body.type, seasonId: req.body.seasonId })
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
