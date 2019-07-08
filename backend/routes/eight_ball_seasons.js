var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

const eight_ball_leagues = require("../models/eight_ball_leagues");

/* 
  GET handler for /api/8ball_season
  Function: To get all the 8 ball seasons
*/
router.get("/", (req, res) => {
  eight_ball_leagues.query().distinct('seasonId').then(
    seasons => {
      res.json(seasons);
    },
    e => {
      res.status(400).json(e);
    }
  );
});

/* 
  DELETE handler for /api/8ball_leagues/delete/season
  Function: To delete seasons (NOTE YET IMPLEMENTED IN THE UI)
*/
router.delete("/delete/season", (req, res) => {
  const body = _.pick(req.body, "seasonId");

  const schema = {
    seasonId: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_ball_leagues
    .query()
    .delete()
    .where({seasonId: body.seasonId})
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
