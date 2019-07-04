var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require('joi')

const eight_ball_leagues = require("../models/eight_ball_leagues");

/* 
  GET handler for /api/8ball_leagues
  Function: To get all the players detail in the league
*/
router.get("/", (req, res) => {
  eight_ball_leagues.query().then(
    players => {
      res.json(players);
    },
    e => {
      res.status(400).json(e);
    }
  );
});

/* 
  POST handler for /api/8ball_leagues/add/player
  Function: To add player to the 8 ball league
*/
router.post("/add/player", (req, res) => {
  const body = _.pick(req.body, "seasonId", "staffName");

  const schema = {
    seasonId: Joi.number().integer().required(),
    staffName: Joi.string().required()
  }

  //Validation
  if (Joi.validate(body, schema, { convert: false }).error) {
    res.status(400).json({ status: 'error', error: 'Invalid data' })
    return
  }

  eight_ball_leagues
    .query()
    .insert({ seasonId: body.seasonId, staffName: body.staffName })
    .then(
      player => {
        res.json(player);
      },
      e => {
        res.status(404).json(e);
      }
    );
});

module.exports = router;
