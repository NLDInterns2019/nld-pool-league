var express = require("express");
var router = express.Router();
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");

const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");

/* 
  GET handler for /api/89_ball_league
  Function: To get all the players detail in the 8ball/9ball league
*/
router.get("/", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_leagues
    .query()
    .where({ type: req.query.type })
    .orderBy("points", "desc")
    .orderBy("goalsFor", "desc")
    .orderBy("goalsAgainst", "asc")
    .orderBy("win", "desc")
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
  GET handler for /api/89_ball_league/:seasonId
  Function: To get all the players detail in the specific season
*/
router.get("/:seasonId", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);

  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let seasonId = parseInt(req.params.seasonId, 10);

  eight_nine_ball_leagues
    .query()
    .where({ type: req.query.type, seasonId: seasonId })
    .orderBy("points", "desc")
    .orderBy("goalsFor", "desc")
    .orderBy("goalsAgainst", "asc")
    .orderBy("win", "desc")
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
  POST handler for /api/89ball_league/add/player
  Function: To add player to the 8 ball league (FUTURE USE)
*/
router.post("/add/player", auth.checkJwt, (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
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

  knex("eight_nine_ball_seasons")
    .insert({
      type: req.body.type,
      seasonId: req.body.seasonId
    })
    .then(
      () => {
        knex("eight_nine_ball_leagues")
          .insert({
            type: req.body.type,
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
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  POST handler for /api/89ball_league/add/players
  Function: To add players to the 8 ball league (BATCH INSERT)
*/
router.post("/add/players", auth.checkJwt, (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required(),
    staffs: Joi.array().items(
      Joi.object({
        type: Joi.number()
          .integer()
          .required(),
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

  knex("eight_nine_ball_seasons")
    .insert({
      type: req.body.type,
      seasonId: req.body.seasonId
    })
    .then(
      () => {
        knex.batchInsert("eight_nine_ball_leagues", req.body.staffs, 100).then(
          result => {
            if (result) {
              res.status(200).send();
            }
          },
          e => {
            res.status(400).send(e);
          }
        );
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  PUT handler for /api/89ball_league/recalculate
  Function: To recalculate league values (called on fixture add/edit/delete)
*/
router.put("/recalculate", auth.checkJwt, async (req, res) => {
  let type = req.body.type;
  let seasonId = req.body.seasonId;
  let pVal1, pVal2;

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

  let fixtures = await eight_nine_ball_fixtures.query().where({
    type: type,
    seasonId: seasonId
  });
  if (fixtures === 0) {
    res.status(404).send();
  }
  let leagues = await eight_nine_ball_leagues.query().where({
    type: type,
    seasonId: seasonId
  });
  if (leagues === 0) {
    res.status(404).send();
  }

  //empty necessary values
  for (let i = 0; i < leagues.length; i++) {
    leagues[i].play = 0;
    leagues[i].goalsAgainst = 0;
    leagues[i].goalsFor = 0;
    leagues[i].win = 0;
    leagues[i].lose = 0;
    leagues[i].draw = 0;
    leagues[i].points = 0;
  }

  for (let i = 0; i < fixtures.length; i++) {
    //set pVal1 and pVal2 as the respective players locations within the league table
    for (let j = 0; j < leagues.length; j++) {
      if (leagues[j].staffName == fixtures[i].player1) {
        pVal1 = j;
      } else if (leagues[j].staffName == fixtures[i].player2) {
        pVal2 = j;
      }
    }

    //const pVal1 = _.find(leagues, league => league.staffName === fixtures[i].player1)
    //const pVal2= _.find(leagues, league => league.staffName === fixtures[i].player2)

    if (fixtures[i].score1 == 2) {
      //p1 won
      leagues[pVal1].win++;
      leagues[pVal2].lose++;
    } else if (fixtures[i].score1 == 1) {
      //draw
      leagues[pVal1].draw++;
      leagues[pVal2].draw++;
    } else if (fixtures[i].score1 == 0) {
      //p1 lost
      leagues[pVal1].lose++;
      leagues[pVal2].win++;
    } //nothing for null bc it hasn't been played

    //set goalsfor, goalsagainst and points
    leagues[pVal1].goalsAgainst =
      leagues[pVal1].goalsAgainst + fixtures[i].score2;
    leagues[pVal2].goalsAgainst =
      leagues[pVal2].goalsAgainst + fixtures[i].score1;

    leagues[pVal1].goalsFor = leagues[pVal1].goalsFor + fixtures[i].score1;
    leagues[pVal2].goalsFor = leagues[pVal2].goalsFor + fixtures[i].score2;

    leagues[pVal1].points = leagues[pVal1].draw + leagues[pVal1].win * 3;
    leagues[pVal2].points = leagues[pVal2].draw + leagues[pVal2].win * 3;

    //increase plays if score wasn't null
    if (fixtures[i].score1 !== null) {
      leagues[pVal1].play++;
      leagues[pVal2].play++;
    }
  }

  //patch league db line by line
  for (let i = 0; i < leagues.length; i++) {
    await eight_nine_ball_leagues
      .query()
      .findOne({
        type: type,
        seasonId: seasonId,
        staffName: leagues[i].staffName
      })
      .patch(leagues[i])
      .then(
        newLeague => {
          if (newLeague === 0) {
            res.status(404).send();
          }
        },
        e => {
          res.status(400).send("patch error");
          return;
        }
      );
  }
  res.json(leagues);
});

/* 
  DELETE handler for /api/89ball_league/delete/player
  Function: To delete player from the league
*/
router.delete("/delete/player", auth.checkJwt, (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
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

  //DUE TO MSSQL NOT SUPPORTING CYCLIC CONSTRAINT
  eight_nine_ball_fixtures
    .query()
    .delete()
    .where({
      type: req.body.type,
      seasonId: req.body.seasonId,
      player1: req.body.staffName
    })
    .orWhere({
      type: req.body.type,
      seasonId: req.body.seasonId,
      player2: req.body.staffName
    })
    .then(
      () => {
        eight_nine_ball_leagues
          .query()
          .delete()
          .where({
            type: req.body.type,
            seasonId: req.body.seasonId,
            staffName: req.body.staffName
          })
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
              res.status(500).send(e);
            }
          );
      },
      e => {
        res.status(500).send(e);
      }
    );
});

/* 
  PUT handler for /api/89ball_league/paid
  Function: To 
*/
router.put("/paid", auth.checkJwt, (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
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

  eight_nine_ball_leagues
    .query()
    .where({
      type: req.body.type,
      seasonId: req.body.seasonId,
      staffName: req.body.staffName
    })
    .patch({paid: true})
    .then(result => {
      if(result===0){
        res.status(404).send();
      }
      res.json(result)
    }, e=> {
      res.status(400).send(e);
    })
});

module.exports = router;
