//import maxBy from "lodash";

var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");

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
  POST handler for /api/hall_of_fame/updateclosed
  Function: To handle achievements set when a season is closed
*/
router.post("/updateclosed", async (req, res) => {
  type = parseInt(req.body.type);
  let oldWinRate,
    currentWinRate = 0;

  //the most recent league allows for current winrate: find it's ID
  let getIds = await eight_nine_ball_leagues
    .query()
    .where({
      type: type
    })
    .orderBy("seasonId", "desc");
  if (getIds === 0) {
    res.status(404).send();
    return;
  }
  seasonId = getIds[0].seasonId;

  let currentLeague = await eight_nine_ball_leagues.query().where({
    type: type,
    seasonId: seasonId
  });
  if (currentLeague === 0) {
    res.status(404).send();
    return;
  }

  //the older leagues allow for older winrates
  let pastLeagues = await eight_nine_ball_leagues
    .query()
    .where({
      type: type
    })
    .where("seasonId", "<", "seasonId");
  if (pastLeagues === 0) {
    res.status(404).send();
    return;
  }

  //allow for updates
  let hofAll = await eight_nine_ball_leagues.query().where({
    type: type
  });
  if (hofAll === 0) {
    res.status(404).send();
    return;
  }

  //need number of seasons
  let seasons = await eight_nine_ball_seasons.query().where({
    type: type
  });
  if (seasons === 0) {
    res.status(404).send();
    return;
  }

  for (let j = 0; j < hofAll.length; j++) {
    let locC = -1;

    //get location of entry within currentLeague
    for (let i = 0; i < currentLeague.length; i++) {
      if (currentLeague[i].staffName === hofAll[j].staffName) {
        locC = i;
        break;
      }
    }

    console.log(currentLeague[locC].play + " DDDDDDDDDDD");
    //calculate winrate for the current league
    currentWinRate = (currentLeague[locC].win * 100) / currentLeague[locC].play;

    totalWins = 0;
    totalPlays = 0;
    totalPoints = 0;
    let present = false;

    //count relevant data for past leagues
    for (let i = 0; i < pastLeagues.length; i++) {
      if (pastLeagues[i].staffName === hofAll[j].staffName) {
        present = true;
        totalWins = totalWins + pastLeagues[i].win;
        totalPlays = totalPlays + pastLeagues[i].play;
        totalPoints = totalPoints + pastLeagues[i].points;
      }
    }

    //if user has past league matches, calculate their improvement. if not, set it to 0.
    if (present === true) {
      //calculate the winrate of the past leagues hofAll.improvement = oldWinRate
      oldWinRate = (totalWins * 100) / totalPlays;

      //get % increase/decrease
      hofAll[j].improvement = currentWinRate - oldWinRate;
    } else {
      hofAll[j].improvement = 0;
    }

    //get avg points per season
    hofAll[j].avgPointsSeason = totalPoints / seasons.length;

    //these have to be deleted so that they don't overwrite the data
    delete hofAll[j].seasonId;
    delete hofAll[j].id;
    delete hofAll[j].play;
    delete hofAll[j].win;
    delete hofAll[j].draw;
    delete hofAll[j].lose;
    delete hofAll[j].goalsFor;
    delete hofAll[j].goalsAgainst;
    delete hofAll[j].points;
    delete hofAll[j].paid;
    delete hofAll[j].form;

    //patch database
    await hall_of_fame
      .query()
      .findOne({
        type: type,
        staffName: hofAll[j].staffName
      })
      .patch(hofAll[j]);
  }
  //success!
  res.status(200).send();
});

/* 
  POST handler for /api/89ball_league/hall_of_fame/calculate_v2
  Function: To calculate HoF achievement
*/
router.post("/calculate_v2", async (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number().required(),
    player1: Joi.string().required(),
    score1: Joi.number().required(),
    player2: Joi.string().required(),
    score2: Joi.number().required()
  };

  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  /************
   * PLAYER 1 *
   ************/
  let player1 = await hall_of_fame
    .query()
    .findOne({ staffName: req.body.player1, type: req.body.type });
  //Add player to the DB if they doesn't exist
  if (!player1) {
    await knex("hall_of_fame")
      .insert({
        type: req.body.type,
        staffName: req.body.player1
      })
      .then(async () => {
        player1 = await hall_of_fame
          .query()
          .findOne({ staffName: req.body.player1, type: req.body.type });
      });
  }
  //IMPORTANT.. ID NEEDS TO BE DELETED, PATCHING ID IS NOT ALLOWED
  delete player1.id;

  /************
   * PLAYER 2 *
   ************/
  let player2 = await hall_of_fame
    .query()
    .findOne({ staffName: req.body.player2, type: req.body.type });
  //Add to DB if not exist
  if (!player2) {
    await knex("hall_of_fame")
      .insert({
        type: req.body.type,
        staffName: req.body.player2
      })
      .then(async () => {
        player2 = await hall_of_fame
          .query()
          .findOne({ staffName: req.body.player2, type: req.body.type });
      });
  }
  //IMPORTANT.. ID NEEDS TO BE DELETED, PATCHING ID IS NOT ALLOWED
  delete player2.id;

  /**************
   * TOP PLAYER *
   **************/
  let topPlayer;
  await hall_of_fame
    .query()
    .orderBy("winRate", "desc")
    .orderBy("wins", "desc")
    .first()
    .then(player => {
      if (player.winRate > 0) {
        topPlayer = player;
      }
    });

  /**********
   * Scrappy *
   ***********/
  if (topPlayer) {
    const isPlayer1Top = req.body.player1 === topPlayer.staffName;
    const isPlayer2Top = req.body.player2 === topPlayer.staffName;
    if (isPlayer1Top) {
      player2.scrappyPlays++;
      if (req.body.score2 > req.body.score1) {
        player2.scrappy++;
      }
    }
    if (isPlayer2Top) {
      player1.scrappyPlays++;
      if (req.body.score1 > req.body.score2) {
        player1.scrappy++;
      }
    }
  }

  /****************
   * Scrappy Rate *
   ****************/
  player1.scrappyRate = Math.round(
    (player1.scrappy * 100) / player1.scrappyPlays
  );
  player2.scrappyRate = Math.round(
    (player2.scrappy * 100) / player2.scrappyPlays
  );

  /*********
   * PLAYS *
   *********/
  player1.plays++;
  player2.plays++;

  /**********************************************************************
   * WIN, LOSS, DRAW, CURRENT STREAK, CURRENT LOSS STREAK, TOTAL POINTS *
   **********************************************************************/
  if (req.body.score1 > req.body.score2) {
    //PLAYER 1 WIN
    player1.wins++;
    player2.loss++;
    player1.curStreak++;
    player1.curLosingStreak = 0;
    player2.curLosingStreak++;
    player2.curStreak = 0;
    player1.totalPoints += 3;
  } else if (req.body.score2 > req.body.score1) {
    //PLAYER 2 WIN
    player2.wins++;
    player1.loss++;
    player2.curStreak++;
    player2.curLosingStreak = 0;
    player1.curLosingStreak++;
    player1.curStreak = 0;
    player2.totalPoints += 3;
  } else {
    //DRAW
    player1.draws++;
    player2.draws++;
    player1.curStreak = 0;
    player1.curLosingStreak = 0;
    player2.curStreak = 0;
    player2.curLosingStreak = 0;
    player1.totalPoints++;
    player2.totalPoints++;
  }

  /**********************************************
   * WIN RATE, LOSS RATE, DRAW RATE, AVG POINTS *
   **********************************************/
  player1.winRate = Math.round((player1.wins * 100) / player1.plays);
  player1.drawRate = Math.round((player1.draws * 100) / player1.plays);
  player1.lossRate = Math.round((player1.loss * 100) / player1.plays);
  player1.avgPoints = parseFloat(player1.totalPoints / player1.plays).toFixed(
    2
  );

  player2.winRate = Math.round((player2.wins * 100) / player2.plays);
  player2.drawRate = Math.round((player2.draws * 100) / player2.plays);
  player2.lossRate = Math.round((player2.loss * 100) / player2.plays);
  player2.avgPoints = parseFloat(player2.totalPoints / player2.plays).toFixed(
    2
  );

  /***************************
   * WIN STREAK, LOSS STREAK *
   ***************************/
  //P1
  if (player1.curStreak > player1.winningStreak) {
    player1.winningStreak = player1.curStreak;
  }
  if (player1.curLosingStreak > player1.losingStreak) {
    player1.losingStreak = player1.curLosingStreak;
  }
  //P2
  if (player2.curStreak > player2.winningStreak) {
    player2.winningStreak = player2.curStreak;
  }
  if (player2.curLosingStreak > player2.losingStreak) {
    player2.losingStreak = player2.curLosingStreak;
  }

  /*****************
   * Highest Points*
   *****************/
  await eight_nine_ball_leagues
    .query()
    .findOne({
      type: req.body.type,
      staffName: req.body.player1,
      seasonId: req.body.seasonId
    })
    .then(p1 => {
      if (p1.points > player1.highestPoints) {
        player1.highestPoints = p1.points;
      }
    });
  await eight_nine_ball_leagues
    .query()
    .findOne({
      type: req.body.type,
      staffName: req.body.player2,
      seasonId: req.body.seasonId
    })
    .then(p2 => {
      if (p2.points > player2.highestPoints) {
        player2.highestPoints = p2.points;
      }
    });

  /***************
   * Punctuality *
   ***************/
  await eight_nine_ball_leagues
    .query()
    .where({ staffName: req.body.player1, type: req.body.type })
    .sum("punctuality as sum")
    .then(points => {
      player1.punctuality = points[0].sum;
    });
  await eight_nine_ball_leagues
    .query()
    .where({ staffName: req.body.player2, type: req.body.type })
    .sum("punctuality as sum")
    .then(points => {
      player2.punctuality = points[0].sum;
    });

  /********************
   * Punctuality Rate *
   ********************/
  player1.punctRate = Math.round((player1.punctuality * 100) / player1.plays);
  player2.punctRate = Math.round((player2.punctuality * 100) / player2.plays);

  /*************
   * PATCH HOF *
   *************/
  await hall_of_fame
    .query()
    .findOne({ type: req.body.type, staffName: req.body.player1 })
    .patch(player1);
  await hall_of_fame
    .query()
    .findOne({ type: req.body.type, staffName: req.body.player2 })
    .patch(player2);

  res.status(204).send();
});

module.exports = router;
