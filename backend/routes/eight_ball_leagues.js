var express = require("express");
var router = express.Router();
const Joi = require("joi");
const knex = require("../db/knex");

const eight_ball_leagues = require("../models/eight_ball_leagues");

/* 
  GET handler for /api/8ball_league
  Function: To get all the players detail in the league
*/
router.get("/", (req, res) => {
  eight_ball_leagues
    .query()
    .orderBy("points", "desc")
    .then(
      players => {
        res.json(players);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  POST handler for /api/8ball_league/add/player/:seasonId
  Function: To get all the players detail in the league of the SPECIFIED season
*/

router.get("/:seasonId", (req, res) => {
  let seasonId = parseInt(req.params.seasonId, 10);

  eight_ball_leagues
    .query()
    .where({ seasonId: seasonId })
    .orderBy("points", "desc")
    .then(
      players => {
        if (!players.length) res.status(404).send();
        else res.json(players);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  POST handler for /api/8ball_league/add/player
  Function: To add player to the 8 ball league
*/
router.post("/add/player", (req, res) => {
  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  knex("eight_ball_leagues")
    //Check
    .select()
    .where("seasonId", req.body.seasonId)
    .then(
      result => {
        if (result === 0) {
          return knex("eight_ball_leagues")
            .insert({
              seasonId: req.body.seasonId,
              staffName: req.body.staffName
            })
            .then(
              player => {
                res.json(player);
              },
              e => {
                res.status(400).json(e);
              }
            );
        } else {
          res.status(400).send();
        }
      },
      e => {
        res.status(500).send();
      }
    );
});

/* 
  POST handler for /api/8ball_league/add/players
  Function: To add players to the 8 ball league (BATCH INSERT)
*/
router.post("/add/players", (req, res) => {
  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
    staffs: Joi.array().items(
      Joi.object({
        seasonId: Joi.number()
          .integer()
          .required(),
        staffName: Joi.string().required()
      })
    )
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  knex("eight_ball_leagues")
    //Check
    .select()
    .where("seasonId", req.body.seasonId)
    .then(
      result => {
        if (result.length === 0) {
          return knex
            .batchInsert("eight_ball_leagues", req.body.staffs, 100)
            .then(
              result => {
                if (result) {
                  res.status(200).send();
                }
              },
              e => {
                res.status(400).send();
              }
            );
        } else {
          res.status(400).send();
        }
      },
      e => {
        res.status(500).send();
      }
    );
});

/* 
  DELETE handler for /api/8ball_league/delete/player
  Function: To delete player from the league (NOTE YET IMPLEMENTED IN THE UI)
*/
router.delete("/delete/player", (req, res) => {
  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
    staffName: Joi.string().required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_ball_leagues
    .query()
    .delete()
    .where({ seasonId: req.body.seasonId, staffName: req.body.staffName })
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
