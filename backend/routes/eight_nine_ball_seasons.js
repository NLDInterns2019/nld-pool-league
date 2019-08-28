var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");
var token = require("../test/function/token");
var axios = require("axios");

const eight_nine_ball_seasons = require("../models/eight_nine_ball_seasons");
const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");
const position_history = require("../models/position_history");

/* 
  GET handler for /api/89ball_season
  Function: To get all the 8/9 ball seasons
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

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type })
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
  GET handler for /api/89ball_season/unplayed
  Function: To get all the 8/9 ball seasons
*/
router.get("/unplayed", (req, res) => {
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

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type, finished: false })
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
  GET handler for /api/89ball_season/finished
  Function: To get all the 8/9 ball seasons
*/
router.get("/finished", (req, res) => {
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

  let where = {
    type: req.query.type
  };

  //Params handling
  if (req.query.hasOwnProperty("staffName") && req.query.staffName !== " ") {
    where.staffName = req.query.staffName;
  }

  position_history
    .query()
    .where(where)
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
  GET handler for /api/89ball_season/latest
  Function: To get all the latest season
*/
router.get("/latest", (req, res) => {
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

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type })
    .max("seasonId as seasonId")
    .then(
      season => {
        res.json(season);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/89ball_season/playersdb
  Function: To get players from auth0 db
*/
router.get("/playersdb", auth.checkJwt, (req, res) => {
  token().then(
    result => {
      axios
        .get(`https://${process.env.DOMAIN}/api/v2/users`, {
          params: {
            search_engine: "v3"
          },
          headers: { Authorization: `Bearer ${result}` }
        })
        .then(players => {
          res.json(players.data);
        });
    },
    e => {
      res.status(400).send();
    }
  );
});

/* 
  DELETE handler for /api/89ball_season/delete/
  Function: To delete seasons (NOTE YET IMPLEMENTED IN THE UI)
*/
router.delete("/delete", auth.checkJwt, (req, res) => {
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

  eight_nine_ball_seasons
    .query()
    .delete()
    .where({ type: req.body.type, seasonId: req.body.seasonId })
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

/* 
  PUT handler for /api/89ball_season/close
  Function: To close a season
*/
router.put("/close", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required(),
    playoff: Joi.any()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  //close season
  await eight_nine_ball_seasons
    .query()
    .findOne({ type: req.body.type, seasonId: req.body.seasonId })
    .patch({ finished: true, playoff: false })
    .then(
      async result => {
        if (result === 0) {
          res.status(404).send();
          return;
        }
        if (req.body.playoff === false || req.body.playoff === 0) {
          await eight_nine_ball_fixtures
            .query()
            .where({
              type: req.body.type,
              seasonId: req.body.seasonId,
              score1: null,
              score2: null
            })
            .patch({ score1: 1, score2: 1 });
        }
      },
      e => {
        res.status(400).json(e);
      }
    );

  //delete position history (reset)
  position_history
    .query()
    .delete()
    .where({ type: req.body.type, seasonId: req.body.seasonId })
    .catch(e => {
      res.status(400).send(e);
    });

  //Update position history
  let positions = [];
  eight_nine_ball_leagues
    .query()
    .where({ type: req.body.type, seasonId: req.body.seasonId })
    .orderBy("points", "desc")
    .orderBy("goalsFor", "desc")
    .orderBy("goalsAgainst", "asc")
    .orderBy("win", "desc")
    .then(
      players => {
        players.map((player, i) => {
          let finalPos = i + 1;

          //DETEMINE POSITION EVEN IF THERE IS DRAW
          if (i !== 0) {
            let finalIndex = i - 1;

            while (
              finalIndex >= 0 &&
              players[finalIndex].points !== 0 &&
              players[finalIndex].points === player.points &&
              players[finalIndex].goalsFor === player.goalsFor &&
              players[finalIndex].goalsAgainst === player.goalsAgainst
            ) {
              finalIndex--;
            }
            finalPos = finalIndex + 2;
          }

          positions = [
            ...positions,
            {
              type: player.type,
              staffName: player.staffName,
              seasonId: player.seasonId,
              position: finalPos
            }
          ];
        });
        // Batch insert
        knex.batchInsert("position_history", positions, 100).then(
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
  GET handler for /api/89ball_season/:seasonId
  Function: To get specific season finished status
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

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type, seasonId: seasonId })
    .then(
      season => {
        if (season.lenght === 0) {
          res.status(404).json(e);
        }
        res.json(season);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

module.exports = router;
