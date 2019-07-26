var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const auth = require("../auth");
const knex = require("../db/knex");

const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const hall_of_fame = require("../models/hall_of_fame")

//delete player?

/* 
  GET handler for /api/89ball_league/hall_of_fame MAYBE
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
    .where({ type: req.query.type})
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
router.post("/calculate", async (req, res) => { //post or patch? it does both - should it?
  type = req.body.type;
  let hof;

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
    type: type,
  });
  if (leagues === 0) {
    res.status(404).send();
   }

   //set values to 0
  let hof2 = await hall_of_fame.query().where({ //pretty bad solution
    type: type,
  });
  for (let i = 0; i < hof2.length; i++) {
    hof2[i].wins = 0;
    hof2[i].plays = 0;
    hof2[i].draws = 0;
    hof2[i].goalsFor = 0;
  }

  //go through all league rows relevant
  for (let i = 0; i < leagues.length; i++) {
    hof = await hall_of_fame.query().findOne({
      type: type,
      staffName: leagues[i].staffName
    });

    //if the name isn't in the hall of fame, add it
    if (typeof hof === "undefined") { 
      knex("hall_of_fame")
      .insert({
        staffName: leagues[i].staffName,
        type: 8
      }).then(
        hof = await hall_of_fame.query().findOne({ //or length
            type: type,
            staffName: leagues[i].staffName
          })
      )
    }
    
    //look for best game
    if (leagues[i].goalsFor > hof.goalsFor) {
      hof.goalsFor = leagues[i].goalsFor;
    }

    //calculations
    hof.wins = hof.wins + leagues[i].win;
    hof.plays = hof.plays + leagues[i].play;
    hof.draws = hof.draws + leagues[i].draw;
    hof.punctuality = hof.punctuality + leagues[i].punctuality;
    hof.percentage = Math.trunc((hof.wins * 100) /hof.plays);

    //patch
    let hof3 = await hall_of_fame.query().findOne({
        type: type,
        staffName: leagues[i].staffName
      }).patch(hof);
  }
  res.json(hof)
});

module.exports = router;
