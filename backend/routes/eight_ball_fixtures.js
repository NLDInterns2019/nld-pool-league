var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

const eight_ball_leagues = require("../models/eight_ball_leagues");
const eight_ball_fixtures = require("../models/eight_ball_fixtures");


/* 
  GET handler for /api/8ball_fixtures
  Function: To get all the fixtures
*/
router.get("/", (req, res) => {
  eight_ball_fixtures.query().then(
    fixture => {
      res.json(fixture);
    },
    e => {
      res.status(400).json(e);
    }
  );
});

/* 
  GET handler for /api/8ball_fixtures/:seasonId
  Function: To get all the fixtures in the specified season
*/
router.get("/:seasonId", (req, res) => {
  let seasonId = parseInt(req.params.seasonId, 10);

  eight_ball_fixtures
    .query()
    .where({ seasonId: seasonId })
    .then(
      fixture => {
        res.json(fixture);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  PUT handler for /api/8ball_fixture/edit/
  Function: To update the score
*/


/*
  POST handler for /api/8ball_fixture/generate/
  Function: To get all the fixtures in the specified season
*/
router.post("/generate", async (req, res) => {
  const schema = {
    seasonId: Joi.number()
      .integer()
      .required()
  };

  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let seasonId = req.body.seasonId;

  //Get the staff name of the specified season and store it in players array
  const players = await eight_ball_leagues.query().where({seasonId: seasonId})

  //LOOP
  for(let i=0; i<players.length; i++){
    for(let j=i+1; j<players.length; j++){
        const fixture = {
            seasonId : seasonId,
            player1: players[i].staffName,
            player2: players[j].staffName
        }
        eight_ball_fixtures.query()
        .whereNotExists(fixture)
        .insert(fixture)
        .catch(e => {
            res.status(400).send();
            return;
        })
    }
  }

  res.status(200).send();
});

module.exports = router;
