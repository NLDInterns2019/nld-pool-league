var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");

const eight_ball_leagues = require("../models/eight_ball_leagues");
const eight_ball_fixtures = require("../models/eight_ball_fixtures");

const score = require("../functions/score");
const fixture_split = require("../functions/polygonshuffle");
const fixturegen = require("../functions/fixturegen");
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
  GET handler for /api/8ball_fixture/group/:seasonId
  Function: To get the number of distinct group
*/
router.get("/group/:seasonId", (req, res) => {
  let seasonId = parseInt(req.params.seasonId, 10);

  eight_ball_fixtures
    .query()
    .where({ seasonId: seasonId })
    .countDistinct("group as count")
    .then(
      count => {
        res.json(count);
      },
      e => {
        res.status(400).send();
      }
    );
});

/* 
  GET handler for /api/8ball_fixture/due/:staffName
  Function: To get all the fixtures unplayed by a user. Caps sensitive.
*/
router.get("/due/:staffName", (req, res) => {
  let staffName = req.params.staffName;
  eight_ball_fixtures
    .query()
    .where({ score1: null })
    .where({ player1: staffName })
    .orWhere({player2: staffName})
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
  GET handler for /api/8ball_fixture/due/:staffName
  Function: To get all the fixtures unplayed by a user. Caps sensitive.
*/
router.get("/unplayed/:seasonId", (req, res) => {
  let seasonId = parseInt(req.params.seasonId);
  eight_ball_fixtures
    .query()
    .where({ seasonId: seasonId })
    .where({ score1: null })
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


/* 
  POST handler for /api/8ball_fixture/generate/. 
  Function: Handles fixture generation and fixture splitting
  TODO: may want to put dates in their own table and connect to fixtures via groups
*/
router.post("/generate", async (req, res) => { //no longer tiny :(
  //this date method makes it difficult to do the comparisons to look for overdue fixtures. might want to look into fixing storage of the raw date.
  var group = 0;
  var startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  var aesDate = startDate; //used to stop issue where date was placed in database in milliseconds of next month
  let seasonId = req.body.seasonId;

  //take the seasonid and see if it's acceptable
  const schema = {
    seasonId: Joi.number()
      .integer()
      .required(),
  };
  
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

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
  let exCount = 1;
  if (playerCount%2>0) {
   exCount = 0;
  }
  //this gets a fixture and puts it into fixtSets
  for (var j = 0; j<playerCount-exCount; j++) { //this represents fixture groups -1
    aesDate = startDate;
    var dd = String(aesDate.getDate()).padStart(2, '0');
    var mm = String(aesDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = aesDate.getFullYear();
    aesDate = dd + '-' + mm + '-' + yyyy;
    var d = new Date(aesDate);
    console.log('here is aesdate ' + d)

    fixture = fixturegen.fixtureCalc(players, seasonId , group, d) //this represents the fixture rows
    knex.batchInsert("eight_ball_fixtures", fixture, 100).then(
      result => {
        if (result) {
          res.status(200).send();
        }
      },
      e => {
        res.status(400).send(); 
      }
    );
    group++;
    startDate.setDate(startDate.getDate() + 7);
    //console.log(aesDate);
    //datet = new Date('25-01-2019S');
   // console.log(datet);
    //var date = new Date(aesGroup.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
//console.log(date);
    players = fixture_split.polygonShuffle(players); //rotate players for next fixture
  }
});

/* 
  POST handler for /api/8ball_fixture/generate/. 
  Function: Displays list of overdue fixtures.
*/
router.get("/overdue", (req, res) => {
  let seasonId = parseInt(req.params.seasonId);
  let currentDate = new Date();
  eight_ball_fixtures
    .query()
    .where({ seasonId: seasonId })
    .where( 'date','!=',currentDate )
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
module.exports = router;
