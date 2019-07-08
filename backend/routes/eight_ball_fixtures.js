var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

const eight_ball_leagues = require("../models/eight_ball_leagues");
const eight_ball_fixtures = require("../models/eight_ball_fixtures");

/* 
  GET handler for /api/8ball_fixture
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
  GET handler for /api/8ball_fixture/:seasonId
  Function: To get all the fixtures in the specified season
*/
router.get("/:seasonId", (req, res) => {
  let seasonId = parseInt(req.params.seasonId, 10);

  eight_ball_fixtures
    .query()
    .where({ seasonId: seasonId })
    .then(
      fixture => {
        if (!fixture.length) {
          res.status(404).send();
        } else {
          res.send(fixture);
        }
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  PUT handler for /api/8ball_fixture/edit/
  Function: To update the score
  TODO: BREAK DOWN TO MORE MODULAR METHODS!
*/
router.put("/edit", async (req, res) => {
  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
    player1: Joi.string().required(),
    score1: Joi.number().required(),
    player2: Joi.string().required(),
    score2: Joi.number().required()
  };

  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  //Check if fixture exist and score is still null (means fixture hasnt been played)
  let fixture;
  try {
    fixture = await eight_ball_fixtures.query().findOne({
      seasonId: req.body.seasonId,
      player1: req.body.player1,
      score1: null,
      player2: req.body.player2,
      score2: null
    });

    if (!fixture) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
  }

  let player1, oriPlayer1;
  let player2, oriPlayer2;

  //Fetch player1
  try {
    oriPlayer1 = await eight_ball_leagues.query().findOne({
      seasonId: req.body.seasonId,
      staffName: req.body.player1
    });
    if (!oriPlayer1) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }
  player1 = _.cloneDeep(oriPlayer1);

  //Fetch player2
  try {
    oriPlayer2 = await eight_ball_leagues.query().findOne({
      seasonId: req.body.seasonId,
      staffName: req.body.player2
    });
    if (!oriPlayer2) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }
  player2 = _.cloneDeep(oriPlayer2);

  /* LEAGUE ALGORITHM */
  //Increment the play
  player1.play++;
  player2.play++;

  //Increment the for and againts
  player1.goalsFor = oriPlayer1.goalsFor + req.body.score1;
  player1.goalsAgainst = oriPlayer1.goalsAgainst + req.body.score2;

  player2.goalsFor = oriPlayer2.goalsFor + req.body.score2;
  player2.goalsAgainst = oriPlayer2.goalsAgainst + req.body.score1;

  //Find out who won
  if (req.body.score1 > req.body.score2) {
    player1.win++;
    player2.lost++;
  } else if (req.body.score1 < req.body.score2) {
    player1.lost++;
    player2.win++;
  } else {
    player1.draw++;
    player2.draw++;
  }

  //Calculate score
  player1.points = player1.win * 3 + player1.draw;
  player2.points = player2.win * 3 + player2.draw;

  //UPDATE FIXTURE TABLE
  try {
    let result = await eight_ball_fixtures
      .query()
      .findOne(fixture)
      .patch({
        score1: req.body.score1,
        score2: req.body.score2
      });

    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //UPDATE PLAYER1 IN LEAGUE TABLE
  try {
    let result = await eight_ball_leagues
      .query()
      .findOne(oriPlayer1)
      .patch(player1);

    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send("5");
    return;
  }

  //UPDATE PLAYER2 IN LEAGUE TABLE
  try {
    let result = await eight_ball_leagues
      .query()
      .findOne(oriPlayer2)
      .patch(player2);
    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send("6");
    return;
  }

  //EVERYTHING SUCCEED
  res.status(200).send();
});

/* !!!!!!!!!!!!!UNFINISHED
  POST handler for /api/8ball_fixture/generate/. On test URL for now. Replaces previous generate method.
  Function: Handles fixture generation and fixture splitting
*/
router.get("/test", (req, res) => {
  /*
Method:
namePolygon A B C D E F
1: AB CD EF
namePolygon B C D E F A
2: BC DE FA
repeat until namePolyon is in original position.
Each round is an individual set of fixtures.
*/
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
  let players;
  try {
    players = await eight_ball_leagues
      .query()
      .where({ seasonId: seasonId });
    if (players.length <= 1) {
      res.status(400).send("Not enough player");
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //LOOP
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const fixture = {
        seasonId: seasonId,
        player1: players[i].staffName,
        player2: players[j].staffName
      };
      eight_ball_fixtures
        .query()
        .whereNotExists(fixture)
        .insert(fixture)
        .catch(e => {
          res.status(400).send();
          return;
        });
    }
  }

  res.status(200).send();
});

module.exports = router;
