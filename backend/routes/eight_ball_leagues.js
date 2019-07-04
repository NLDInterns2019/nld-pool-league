var express = require("express");
var router = express.Router();

const eight_ball_leagues = require('../models/eight_ball_leagues');

/* 
  GET handler for /api/8ball_leagues
  Function: To get all the players detail in the league
*/
router.get("/", (req, res) => {
  eight_ball_leagues.query()
  .then(players => {
    res.json(players)
  }, e => {
    res.status(400).json(e);
  })
});

//POST handler for /api/8ball_leagues/add/player
router.post("/add/player", (req, res) => {
});

module.exports = router;
