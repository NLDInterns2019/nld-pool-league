var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");

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

  const leagueAttributes = {
    seasonId: req.body.seasonId,
    player1: req.body.player1,
    score1: null,
    player2: req.body.player2,
    score2: null
  }

  const p1Attributes = {
    seasonId: req.body.seasonId,
    staffName: req.body.player1
  }

  const p2Attributes = {
    seasonId: req.body.seasonId,
    staffName: req.body.player2
  }

  //Check if fixture exist and score is still null (means fixture hasnt been played)
  try {
    let fixture = await eight_ball_fixtures.query().findOne(leagueAttributes);

    if (!fixture) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
  }

  let player1;
  let player2;

  //Fetch player1
  try {
    player1 = await eight_ball_leagues.query().findOne(p1Attributes);
    if (!player1) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //Fetch player2
  try {
    player2 = await eight_ball_leagues.query().findOne(p2Attributes);
    if (!player2) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  /* LEAGUE ALGORITHM */
  //Increment the play
  player1.play++;
  player2.play++;

  //Increment the for and againts
  player1.goalsFor = player1.goalsFor + req.body.score1;
  player1.goalsAgainst = player1.goalsAgainst + req.body.score2;

  player2.goalsFor = player2.goalsFor + req.body.score2;
  player2.goalsAgainst = player2.goalsAgainst + req.body.score1;

  //Find out who won
  if (req.body.score1 > req.body.score2) {
    player1.win++;
    player2.lose++;
  } else if (req.body.score1 < req.body.score2) {
    player1.lose++;
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
      .findOne(leagueAttributes)
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

  console.log(player1);
  console.log(player2);

  //UPDATE PLAYER1 IN LEAGUE TABLE
  try {
    let result = await eight_ball_leagues
      .query()
      .findOne(p1Attributes)
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
      .findOne(p2Attributes)
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
  totalPlayers = 5; //placeholder
  //
  /*
  Uses a polygon to split the matches into separate fixtures. 
  One 'corner' of the polygon represents a player. One player is separated from the group and used as a centre piece.
  Initial fixture: 
      max represents the centre. 1
      1,n-1    2,n-2     etc. These value groupings are stored.
  When the players converge, this represents the end of a fixture. The polygon is now rotated one movement clockwise. The centre player remains.
  The previous fixture is compared. 
Method:
namesPolygon = 
           1                                        1
         5 6 2                                   7      2
          4 3                                    6   8  3
namesPolygon = B C D E A                           5   4

1. 15 24 36                                     1. 17 26 35 48
                                                2. 12 37 46 58
namesPolygon =                                  3. 23 41 57 68
           2                                    4. 34 52 61 78
         1 6 3
          5 4                                   In each new fixture, values have been incremented by 1. If they reach N, values are reverted to 1. 

2. 12 35 46
3. 23 14 56   
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
    players = await eight_ball_leagues.query().where({ seasonId: seasonId });
    if (players.length <= 1) {
      res.status(400).send("Not enough player");
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }
  
  let fixtures = [];
  //LOOP
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      fixtures = [...fixtures, ({
        seasonId: seasonId,
        player1: players[i].staffName,
        player2: players[j].staffName
      })];
    }
  }

  knex.batchInsert("eight_ball_fixtures", fixtures, 100).then(
    result => {
      if (result) {
        res.status(200).send();
      }
    },
    e => {
      res.status(400).send();
    }
  );
});

module.exports = router;
