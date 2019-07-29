var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const auth = require("../auth");
const knex = require("../db/knex");

const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");
const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_seasons = require("../models/eight_nine_ball_seasons");
const hall_of_fame = require("../models/hall_of_fame");

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
  Function: To calculate win percentages
*/
router.post("/calculate", async (req, res) => {
  //post or patch? it does both - should it?
  type = req.body.type;
  let hof;
  let start = true;
  let names = ["", ""];
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let leagues = await eight_nine_ball_leagues.query().where({
    type: type
  });
  if (leagues === 0) {
    res.status(404).send();
  }

  //go through all league rows relevant
  for (let i = 0; i < leagues.length; i++) {
    hof = await hall_of_fame.query().findOne({
      type: type,
      staffName: leagues[i].staffName
    });

    //if the name isn't in the hall of fame, add it
    if (typeof hof === "undefined") { //TODO: this bit is buggy! will only add one user, then throw an error. why?
      knex("hall_of_fame")
        .insert({
          staffName: leagues[i].staffName,
          type: 8
        })
        .then(
          (hof = await hall_of_fame.query().findOne({
            //or length
            type: type,
            staffName: leagues[i].staffName
          }))
        );
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
      hof.wins = 0;
      hof.plays = 0;
      hof.draws = 0;
      hof.punctuality = 0;
      hof.goalsAgainstTop = 0;
      hof.highestGF = 0;
      hof.scrappy = 0;
      hof.streak = 0;
      hof.improvement = 0;
      start = false;
    }

    //look for best game
    if (leagues[i].goalsFor > hof.highestGF) {
      hof.highestGF = leagues[i].goalsFor;
    }

    let seasons = await eight_nine_ball_seasons.query().where({
      type: type
    });

    //store wins and recent wins in different places
    if (seasons.length > 3) {
      //will only come into place with 4 or more seasons
      if (i > seasons.length - 2) {
        hof.improvement = hof.improvement + leagues[i].win;
      } else {
        hof.wins = hof.wins + leagues[i].win;
      }
    } else {
      hof.wins = hof.wins + leagues[i].win;
    }
    //calculations
    hof.plays = hof.plays + leagues[i].play;
    hof.draws = hof.draws + leagues[i].draw;
    //change this calculation when you look at how punctuality is actually done - aiming for a punct point per match played on time
    hof.punctuality = hof.punctuality + leagues[i].punctuality;
    hof.percentage = Math.trunc((hof.wins * 100) / hof.plays);
    hof.drawRate = Math.trunc((hof.draws * 100) / hof.plays);
    hof.punctRate = Math.trunc((hof.punctRate * 100) / hof.plays);

    //patch
    await hall_of_fame
      .query()
      .findOne({
        type: type,
        staffName: leagues[i].staffName
      })
      .patch(hof);
  }

  let fixtures = await eight_nine_ball_fixtures.query().where({
    //must go through fixtures to calculate streak. handle scrappy through here too
    type: type
  });
  if (fixtures === 0) {
    res.status(404).send();
  }
  let hofAll = await hall_of_fame.query().where({
    //must go through fixtures to calculate streak. handle scrappy through here too
    type: type
  });
  if (fixtures === 0) {
    res.status(404).send();
  }

  let player1,
    player2 = 0;
  for (let i = 0; i < fixtures.length; i++) {
    //TODO i should be fired for writing code this bad

    for (let j = 0; j < hofAll.length; j++) {
      //find them in the hof table. locations stored and accessed through hofAll[player1].param
      if (hofAll[j].staffName == fixtures[i].player1) {
        player1 = j;
      } else if (hofAll[j].staffName == fixtures[i].player2) {
        player2 = j;
      } //TODO can't break because that gives a sexy little error
    }

    //update streak or reset as necessary. remember scrappyRate is NOT a permanent place for this value and issues may arise from it later
    if (fixtures[i].score1 > fixtures[i].score2) {
      //if player1 won
      hofAll[player1].scrappyRate++; //if this gives an error then you can't do this
      if (hofAll[player1].scrappyRate > hofAll[player1].streak) {
        hofAll[player1].streak = hofAll[player1].scrappyRate; //update streak
      }
      hofAll[player2].scrappyRate = 0; //no need to update this one. reset
    } else if (fixtures[i].score2 > fixtures[i].score1) {
      //not gonna do anything for draws. can keep streak but no increment.
      hofAll[player2].scrappyRate++;
      if (hofAll[player2].scrappyRate > hofAll[player2].streak) {
        hofAll[player2].streak = hofAll[player2].scrappyRate;
      }
      hofAll[player1].scrappyRate = 0;
    }

    //calculate scrappy. counts points against whoever top player is.
    let topPlayer = _.maxBy(hofAll, "percentage"); //get top player

    if (fixtures[i].name1 == topPlayer) {
      //check if top player played in the fixture
      hofAll[player2].scrappy = hofAll[player2].scrappy + fixtures[i].score2; //if so, increment suitably
    } else if (fixtures[i].name2 == topPlayer) {
      hofAll[player1].scrappy = hofAll[player1].scrappy + fixtures[i].score1;
    }
  }

  //have to go through hof again to calc some averages
  for (let i = 0; i < hofAll.length; i++) {
    hofAll[i].scrappyRate = Math.trunc(
      (hofAll[i].scrappy * 100) / hofAll[i].plays
    );
    hofAll[i].improvement = Math.trunc((hofAll[i].improvement * 100) / 2);

    let seasons = await eight_nine_ball_seasons.query().where({
      type: type
    });
    //calculate wins as suitable
    if (seasons.length > 3) {
      hofAll[i].percentage = Math.trunc(
        (hofAll[i].wins * 100) / hofAll[i].plays - 2
      );
    } else {
      console.log(hofAll[i].wins + " * 100 / ");
      hofAll[i].percentage = Math.trunc(
        (hofAll[i].wins * 100) / hofAll[i].plays
      );
    }

    //put into the DB
    let hofAll2 = await hall_of_fame.query().findOne({
      type: type,
      staffName: hofAll[i].staffName
    });
    let hof4 = await hall_of_fame
      .query()
      .findOne({
        type: type,
        staffName: hofAll[i].staffName
      })
      .patch(hofAll2);
  }
  res.json(hofAll);
});

module.exports = router;
