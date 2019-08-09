var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");
const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_seasons = require("../models/eight_nine_ball_seasons");
const hall_of_fame = require("../models/hall_of_fame");

const scrappyGen = require("../functions/scrappy");
const streakGen = require("../functions/streaks");

/* 
  GET handler for /api/89ball_league/hall_of_fame 
  Function: To get the hall of fame
*/
router.get("/", async (req, res) => {
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

  hall_of_fame
    .query()
    .where({ type: req.query.type })
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
  POST handler for /api/89ball_league/hall_of_fame/calculate
  Function: To calculate HoF achievement winners
*/
router.post("/calculate", async (req, res) => {
  type = parseInt(req.body.type, 10);
  let staffInHoF = true;
  let start = true;
  let names = ["", ""];

  let leagues = await eight_nine_ball_leagues.query()
  .where({
    type: type
  });
  if (leagues === 0) {
    res.status(404).send();
    return;
  }

  //go through all league rows relevant
  for (let i = 0; i < leagues.length; i++) {
    hofRow = await hall_of_fame.query().findOne({
      type: type,
      staffName: leagues[i].staffName
    });

    //if the name isn't in the hall of fame, add it
    if (typeof hofRow === "undefined") {
      staffInHoF = false;
      await hall_of_fame.query().insert({
        staffName: leagues[i].staffName,
        type: type
      });
    }

    //then set the row again
    if (staffInHoF == false) {
      hofRow = await hall_of_fame.query().findOne({
        type: type,
        staffName: leagues[i].staffName
      });
    }

    //wipes values without need for extra db call loop
    //check if name has been called
    if (names.includes(leagues[i].staffName)) {
      start = false;
    } else {
      start = true;
      names.push(leagues[i].staffName);
    }

    //if not, add it to the list and set its values to zero
    if (start == true) {
      hofRow.wins = 0;
      hofRow.plays = 0;
      hofRow.draws = 0;
      hofRow.punctuality = 0;
      hofRow.goalsAgainstTop = 0;
      hofRow.highestPoints = 0;
      hofRow.scrappy = 0;
      hofRow.scrappyPlays = 0;
      hofRow.loss = 0;
      hofRow.winningStreak = 0;
      hofRow.improvement = 0;
      hofRow.winRate = 0;
      hofRow.losingStreak = 0;
      hofRow.curStreak = 0;
      hofRow.curLosingStreak = 0;
      start = false;
    }

    /////////////////////////////////////////////////////////////////////////   BEST GAME
    //check if this season is the players best yet
    if (leagues[i].points > hofRow.highestPoints) {
      hofRow.highestPoints = leagues[i].points;
    }

    /////////////////////////////////////////////////////////////////////////   MOST IMPROVED
    //check if improvement should be calculated
    let seasons = await eight_nine_ball_seasons.query().where({
      type: type
    });

    if (seasons.length > 1) { //with more than one season
      hofRow.improvement = hofRow.improvement
    }
   // if (seasons.length > 2) {
      //only with more than 3 seasons
    //  if (i > seasons.length - 1) {
        //and only with the latest two
     //   hofRow.improvement = hofRow.improvement + leagues[i].win;
     // } else {
        hofRow.wins = hofRow.wins + leagues[i].win;
     // }
   // } else {
    //  hofRow.wins = hofRow.wins + leagues[i].win;
    //}

    //basic calculations to aid numerous features
    hofRow.plays = hofRow.plays + leagues[i].play;
    hofRow.draws = hofRow.draws + leagues[i].draw;
    hofRow.loss = hofRow.loss + leagues[i].lose;

    //change this calculation when you look at how punctuality is actually done - aiming for a punct point per match played on time
    hofRow.punctuality = hofRow.punctuality + leagues[i].punctuality;
    //hofRow.winRate = Math.trunc((hofRow.wins * 100) / hofRow.plays);
    hofRow.drawRate = Math.trunc((hofRow.draws * 100) / hofRow.plays);
    hofRow.punctRate = Math.trunc((hofRow.punctRate * 100) / hofRow.plays);
    hofRow.lossRate = Math.trunc((hofRow.loss * 100) / hofRow.plays);

    //update the table
    await hall_of_fame
      .query()
      .findOne({
        type: type,
        staffName: leagues[i].staffName
      })
      .patch(hofRow);
  }

  let fixtures = await eight_nine_ball_fixtures.query().where({
    type: type
  });
  if (fixtures === 0) {
    res.status(404).send();
    return;
  }

  //needs the full HoF DB this time
  let hofAll = await hall_of_fame.query().where({
    type: type
  });
  if (fixtures === 0) {
    res.status(404).send();
    return;
  }

  hofAll = streakGen.calculateStreaks(fixtures, hofAll); ////////////////////////streakCalc

  for (let i = 0; i < hofAll.length; i++) {
    let seasons = await eight_nine_ball_seasons.query().where({
      type: type
    });

    //calculate wins as suitable regarding improvement HoF
   // if (seasons.length > 2) {
      hofAll[i].winRate = Math.trunc(
        (hofAll[i].wins * 100) / hofAll[i].plays) //-1
    //  );
   // } else {
    //  hofAll[i].winRate = Math.trunc((hofAll[i].wins * 100) / hofAll[i].plays);
   // }
  }

  let topPlayer = _.maxBy(hofAll, "winRate"); //get top player
  //this is terrible. i should be fired for writing this
  for (let i = 0; i < fixtures.length; i++) {
    //need a new loop for scrappy so you know who the top player is
    /////////////////////////////////////////////////////////////////////////////////////////////////   SCRAPPY
    if (topPlayer != null) {
      hofAll = scrappyGen.calculateScrappy(
        fixtures,
        topPlayer.staffName,
        hofAll,
        i
      ); //calculate scrappy
    }
  }

  //patch db
  for (let v = 0; v < hofAll.length; v++) {
    await hall_of_fame
      .query()
      .findOne({
        type: type,
        staffName: hofAll[v].staffName
      })
      .patch(hofAll[v]);
  }
  res.json(hofAll);
});

module.exports = router;
