var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");

const eight_ball_leagues = require("../models/eight_ball_leagues");
const eight_ball_fixtures = require("../models/eight_ball_fixtures");

const score = require("../functions/score");

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
  };

  const p1Attributes = {
    seasonId: req.body.seasonId,
    staffName: req.body.player1
  };

  const p2Attributes = {
    seasonId: req.body.seasonId,
    staffName: req.body.player2
  };

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
  try {
    const players = score.calculateScore(
      player1,
      player2,
      req.body.score1,
      req.body.score2
    );
    player1 = _.cloneDeep(players.player1);
    player2 = _.cloneDeep(players.player2);
  } catch (e) {
    res.status(500).send();
    return;
  }

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

//shift values in an array
function polygonShuffle(players) {
  let offsets = 2;
  if (players.length % 2 > 0) {
    offsets = 1;
  }
  var playerCount = players.length-offsets;
  var firstValue = players[0];
  for (var i = 0; i<playerCount; i++) {
      players[i] = players[i+1];
  }
  players[playerCount] = firstValue;
  return players;
}
/* 
  POST handler for /api/8ball_fixture/generate/. 
  Function: Handles fixture generation and fixture splitting
*/
router.post("/generate", async (req, res) => { //no longer tiny :(
  var group = 0;
  
  //take the seasonid and see if it's acceptable
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

  //db call to get names
  let players;
  try {
    players = await eight_ball_leagues.query().where({ seasonId: seasonId });
    if (players.length <= 1) {
      res.status(400).send("Not enough players");
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }
  var playerCount = players.length;
  let fixture = [];
  let offset = 2;
  let exCount = 1;
  if (playerCount%2>0) {
   exCount = 0;
  }
  //this gets a fixture and puts it into fixtSets
  for (var j = 0; j<playerCount-exCount; j++) { //this represents fixture groups -1
    for (var i = 0; i<playerCount/2-1; i++) { //this represents fixture rows. batch insert these. //was /2-1
      fixture = [...fixture, ({
        seasonId: seasonId,
        player1: players[i].staffName,
        player2: players[players.length-i-offset].staffName,
        group: group
      })];
    }
    if (playerCount%2==0) {
    fixture = [...fixture, ({
      seasonId: seasonId,
      player1: players[playerCount-1].staffName,
        player2: players[players.length/2-1].staffName,
        group: group
       })]
    }
    knex.batchInsert("eight_ball_fixtures", fixture, 100).then(
      result => {
        if (result) {
          res.status(200).send();
        }
      },
      e => {
        res.status(400).send(); //always sends this response but still adds to the database fine. no idea why
      }
    );
    fixture = [];
    group++;
    players = polygonShuffle(players); //rotate players for next fixture
  }
});


/*
  POST handler for /api/8ball_fixture/generate/
  Function: To get all the fixtures in the specified season

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
  console.log(players);
  let fixtures = [];
  //LOOP
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      fixtures = [
        ...fixtures,
        {
          seasonId: seasonId,
          player1: players[i].staffName,
          player2: players[j].staffName
        }
      ];
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
*/
module.exports = router;
