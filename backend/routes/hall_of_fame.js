var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");

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
      .required(),
    staffName: Joi.string()
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

  hall_of_fame
    .query()
    .where(where)
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

  let leagues = await eight_nine_ball_leagues.query().where({
    type: type
  });
  if (leagues === 0) {
    res.status(404).send();
    return;
  }

  let i = 0;

  //go through all league rows relevant//
  for (let i = 0; i < leagues.length; i++) {
    hofRow = await hall_of_fame.query().findOne({
      type: type,
      staffName: leagues[i].staffName
    });

    //if the name isn't in the hall of fame, add it
    if (typeof hofRow === "undefined") {
      staffInHoF = false;
      await knex("hall_of_fame").insert({
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

    //IMPORTANT.. ID NEEDS TO BE DELETED, PATCHING ID IS NOT ALLOWED
    delete hofRow.id;

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
      hofRow.scrappyRate = 0;
      hofRow.loss = 0;
      hofRow.winningStreak = 0;
      hofRow.improvement = 0;
      hofRow.winRate = 0;
      hofRow.losingStreak = 0;
      hofRow.curStreak = 0;
      hofRow.curLosingStreak = 0;
      hofRow.totalPoints = 0;
      start = false;
    }

    /////////////////////////////////////////////////////////////////////////   BEST GAME
    //check if this season is the players best yet
    if (leagues[i].points > hofRow.highestPoints) {
      hofRow.highestPoints = leagues[i].points;
    }

    hofRow.wins = hofRow.wins + leagues[i].win;

    //basic calculations to aid numerous features
    hofRow.plays = hofRow.plays + leagues[i].play;
    hofRow.draws = hofRow.draws + leagues[i].draw;
    hofRow.loss = hofRow.loss + leagues[i].lose;
    hofRow.totalPoints = hofRow.totalPoints + leagues[i].points;

    //change this calculation when you look at how punctuality is actually done - aiming for a punct point per match played on time
    hofRow.punctuality = hofRow.punctuality + leagues[i].punctuality;
    //hofRow.winRate = Math.trunc((hofRow.wins * 100) / hofRow.plays);
    if (hofRow.plays !== 0) {
      hofRow.drawRate = Math.trunc((hofRow.draws * 100) / hofRow.plays);
      hofRow.punctRate = Math.trunc((hofRow.punctRate * 100) / hofRow.plays);
      hofRow.lossRate = Math.trunc((hofRow.loss * 100) / hofRow.plays);
      hofRow.avgPoints = parseFloat(hofRow.totalPoints / hofRow.plays).toFixed(
        2
      );
    }

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
    if (hofAll[i].plays > 0) {
      hofAll[i].winRate = Math.trunc((hofAll[i].wins * 100) / hofAll[i].plays);
    } else {
      hofAll[i].winRate = 0;
    }
    if (!(hofAll[i].winRate > 0)) {
      hofAll[i].winRate = 0;
    }
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

  /////////////////////////////////////////////////////////////////////////   MOST IMPROVED
  //check if improvement should be calculated
  let seasons = await eight_nine_ball_seasons.query().where({
    type: type
  });

  for (let i = 0; i < leagues.length; i++) {
    hofRow = await hall_of_fame.query().findOne({
      type: type,
      staffName: leagues[i].staffName
    });

    //change this to get users last played season if not in this one TODO
    if (seasons.length > 1 && leagues[i].seasonId === seasons.length) {
      //with more than one season
      console.log("entered");
      if (leagues[i].play > 0) {
        hofRow.improvementRate = hofRow.improvementRate = parseInt(
          (leagues[i].win * 100) / leagues[i].play
        );
        hofRow.latestWins =
          parseInt(hofRow.improvementRate) - parseInt(hofRow.winRate);
      }

      // console.log(hofRow.latestWins);
      // console.log(
      //   hofRow.staffName +
      //     ": " +
      //     hofRow.improvementRate +
      //     " - " +
      //     hofRow.winRate +
      //     " = " +
      //     hofRow.latestWins
      // );
    } //this will be functional when i figure out why hofrow suddenly can't access winrate. who cares anymore
  }

  for (let v = 0; v < hofAll.length; v++) {
    // console.log(hofAll[v].winRate);
    //IMPORTANT.. ID NEEDS TO BE DELETED, PATCHING ID IS NOT ALLOWED
    delete hofAll[v].id;

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
