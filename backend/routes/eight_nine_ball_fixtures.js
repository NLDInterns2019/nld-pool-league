var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");

const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");

const score = require("../functions/score");
const fixture_split = require("../functions/polygonshuffle");
const fixturegen = require("../functions/fixturegen");
const dayVal = require("../functions/dayVal");
const timeInMillis = require("../functions/timeInMillis");

/* 
  GET handler for /api/89_ball_fixture/group/:seasonId
  Function: To get the number of distinct group
*/
router.get("/group/:seasonId", (req, res) => {
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

  eight_nine_ball_fixtures
    .query()
    .where({ type: req.query.type, seasonId: seasonId })
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
  GET handler for /api/89_ball_fixture/due/:staffName
  Function: To get all the fixtures unplayed by a user. Caps sensitive.
  TODO: FUNCTIONALITY NOT FINISHED
*/
router.get("/due/:staffName", (req, res) => {
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

  let staffName = req.params.staffName;
  eight_nine_ball_fixtures
    .query()
    .where({ score1: null })
    .where({ player1: staffName })
    .orWhere({ player2: staffName })
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
  GET handler for /api/89_ball_fixture/:seasonId
  Function: To get all the fixtures in the specified season
*/
router.get("/:seasonId", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    staffName: Joi.string(),
    hidePlayed: Joi.string()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  //Build the filter
  let where1 = {
    type: req.query.type,
    seasonId: parseInt(req.params.seasonId, 10)
  };
  let where2 = {
    type: req.query.type,
    seasonId: parseInt(req.params.seasonId, 10)
  };

  //Params handling
  if (req.query.hasOwnProperty("staffName") && req.query.staffName !== "") {
    where1.player1 = req.query.staffName;
    where2.player2 = req.query.staffName;
  }
  if (req.query.hasOwnProperty("hidePlayed") && req.query.hidePlayed === "true") {
    where1.score1 = null;
    where1.score2 = null;
    where2.score1 = null;
    where2.score2 = null;
  }

  eight_nine_ball_fixtures
    .query()
    .where(where1)
    .orWhere(where2)
    .then(
      fixture => {
        res.send(fixture);
      },
      e => {
        res.status(500).json(e);
      }
    );
});

/* 
  PUT handler for /api/89ball_fixture/edit/
  Function: To update the score
*/
router.put("/edit", auth.checkJwt, async (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
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
    type: req.body.type,
    seasonId: req.body.seasonId,
    player1: req.body.player1,
    score1: null,
    player2: req.body.player2,
    score2: null
  };

  const p1Attributes = {
    type: req.body.type,
    seasonId: req.body.seasonId,
    staffName: req.body.player1
  };

  const p2Attributes = {
    type: req.body.type,
    seasonId: req.body.seasonId,
    staffName: req.body.player2
  };

  //Check if fixture exist and score is still null (means fixture hasnt been played)
  try {
    let fixture = await eight_nine_ball_fixtures
      .query()
      .findOne(leagueAttributes);

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
    player1 = await eight_nine_ball_leagues.query().findOne(p1Attributes);
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
    player2 = await eight_nine_ball_leagues.query().findOne(p2Attributes);
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
    let result = await eight_nine_ball_fixtures
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
    let result = await eight_nine_ball_leagues
      .query()
      .findOne(p1Attributes)
      .patch(player1);
    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //UPDATE PLAYER2 IN LEAGUE TABLE
  try {
    let result = await eight_nine_ball_leagues
      .query()
      .findOne(p2Attributes)
      .patch(player2);
    if (result === 0) {
      res.status(404).send();
      return;
    }
  } catch (e) {
    res.status(500).send();
    return;
  }

  //EVERYTHING SUCCEED
  res.status(200).send();
});

/* 
  POST handler for /api/89_ball_fixture/generate/. 
  Function: Handles fixture generation and fixture splitting
*/
router.post("/generate", auth.checkJwt, async (req, res) => {
  var group = 0;
  var aesDate = new Date();
  aesDate.setDate(aesDate.getDate() + 7);
  let seasonId = req.body.seasonId;
  let type = req.body.type;

  //take the seasonid and see if it's acceptable
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required()
  };

  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  //db call to get names
  let players;
  try {
    players = await eight_nine_ball_leagues
      .query()
      .where({ type: type, seasonId: seasonId });
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
  if (playerCount % 2 > 0) {
    exCount = 0;
  }
  //this gets a fixture and puts it into fixtSets
  for (var j = 0; j < playerCount - exCount; j++) {
    fixture = fixturegen.fixtureCalc(
      type,
      players,
      seasonId,
      group,
      aesDate.getTime()
    ); //this represents the fixture rows
    knex.batchInsert("eight_nine_ball_fixtures", fixture, 100).then(
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
    aesDate.setDate(aesDate.getDate() + 7);

    players = fixture_split.polygonShuffle(players); //rotate players for next fixture
  }
});

/* 
  POST handler for /api/89ball_fixture/overdue/. 
  Function: Displays list of overdue fixtures.
*/
router.get("/overdue", (req, res) => {
  let currentDate = new Date();
  currentDate = parseInt(currentDate);
  eight_nine_ball_fixtures
    .query()
    .where("date", "!=", currentDate)
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
  POST handler for /api/89ball_fixture/book/. 
  Function: Books a fixture for a particular date.
*/
router.put("/book", async (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  let name = req.body.name;
  let opponent = req.body.opponent;
  let day = req.body.day;
  let time = req.body.time;

  //find the fixture
  const fixt = await eight_nine_ball_fixtures.query().findOne({
    player1: name,
    player2: opponent
  });

  //set the time from the db value to 00:00
  let convDate = new Date(fixt.date);
  console.log("Maximum date: " + convDate.toString());
  let oldDay = convDate
    .toString()
    .split(" ")
    .slice(0, 1)
    .join(" "); //stores day from db
  let oldTime = convDate
    .toString()
    .split(" ")
    .slice(4, 5)
    .join(" "); //stores time from db

  let timeDeduct = timeInMillis.getMillis(oldTime);
  let booked = fixt.date - timeDeduct; //date is now 00:00

  //go back a suitable number of days
  let oPlace = 0;
  oPlace = dayVal.dayValue(oldDay);
  nPlace = dayVal.dayValue(day);

  let multiplier = parseInt(oPlace) - parseInt(nPlace);
  if (multiplier < 0) {
    multiplier = Math.abs(multiplier);
  }
  if (multiplier > 0) {
    multiplier = 7 - multiplier;
  }
  booked = parseInt(booked) - parseInt(86400000) * parseInt(multiplier);

  //add the extra time back on
  let timeAdd = timeInMillis.getMillis(time);
  booked = booked + timeAdd; //this one is stored in the db
  console.log("Matched date: " + new Date(booked).toString()); //this is what it would look like parsed. do NOT store this one

  //add it to the db
  /* const result = await eight_nine_ball_fixtures.query().findOne({
    player1: name,
    player2: opponent
  }).patch(fixt)*/
});

/* 
  POST handler for /api/89ball_fixture/book/edit. 
  Function: Edit a fixture's booking.
*/
router.get("/book/edit", (req, res) => {});

/* 
  POST handler for /api/89ball_fixture/book/. 
  Function: Remove a fixture booking.
*/
router.get("/book/delete", (req, res) => {});
module.exports = router;
