var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");

const eight_nine_ball_fixtures = require("../models/eight_nine_ball_fixtures");
const eight_nine_ball_leagues = require("../models/eight_nine_ball_leagues");
const eight_nine_ball_seasons = require("../models/eight_nine_ball_seasons");
const hall_of_fame = require("../models/hall_of_fame");

const streakGen = require("../functions/streaks");
const windrawGen = require("../functions/windraw");

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

  const numberOfDeletedRows = await hall_of_fame
    .query()
    .delete()
    .where({
      type: type
    });
  console.log("deleted " + numberOfDeletedRows + " rows.");

  knex("hall_of_fame")
    .where("type", 9)
    .del();

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
      hofRow.latestWins = 0;
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
    //hofRow.winRate = Math.round((hofRow.wins * 100) / hofRow.plays);

    let seasons = await eight_nine_ball_seasons.query().where({ type: type });

    if (hofRow.plays !== 0) {
      hofRow.drawRate = Math.round((hofRow.draws * 100) / hofRow.plays);
      hofRow.punctRate = Math.round((hofRow.punctRate * 100) / hofRow.plays);
      hofRow.lossRate = Math.round((hofRow.loss * 100) / hofRow.plays);
      hofRow.avgPoints = parseFloat(hofRow.totalPoints / hofRow.plays).toFixed(
        2
      ); //seasons.length
      hofRow.avgPointsSeason = parseFloat(
        hofRow.totalPoints / seasons.length
      ).toFixed(2);
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
      hofAll[i].winRate = Math.round((hofAll[i].wins * 100) / hofAll[i].plays);
    } else {
      hofAll[i].winRate = 0;
    }
    if (!(hofAll[i].winRate > 0)) {
      hofAll[i].winRate = 0;
    }
  }

  let topPlayer = _.maxBy(hofAll, "winRate"); //get top player

  //this is terrible. i should be fired for writing this
  //for (let i = 0; i < fixtures.length; i++) {
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
  //}
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
      if (leagues[i].play > 0) {
        hofRow.improvementRate = hofRow.improvementRate = parseInt(
          (leagues[i].win * 100) / leagues[i].play
        );
        hofRow.latestWins =
          parseInt(hofRow.improvementRate) -
          parseInt((hofRow.wins * 100) / hofRow.plays);

        delete hofRow.id;
        await hall_of_fame
          .query()
          .findOne({
            type: type,
            staffName: hofRow.staffName
          })
          .patch(hofRow);
      }
    }
  }

  for (let v = 0; v < hofAll.length; v++) {
    // console.log(hofAll[v].winRate);
    //IMPORTANT.. ID NEEDS TO BE DELETED, PATCHING ID IS NOT ALLOWED
    delete hofAll[v].id;
    delete hofAll[v].latestWins;

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

/* 
  POST handler for /api/89ball_league/hall_of_fame/calculate
  Function: To handle achievements set when a season is closed
*/
router.post("/updatehof", async (req, res) => {
  type = parseInt(req.body.type);
  seasonId = parseInt(req.body.seasonId);

  //the most recent league allows for current winrate
  let currentLeague = await eight_nine_ball_leagues.query().where({
    type: type,
    seasonId: seasonId
  });
  if (currentLeague === 0) {
    res.status(404).send();
    return;
  }

  //the older leagues allow for older winrates
  let pastLeagues = await eight_nine_ball_leagues.query().where({
    type: type
  })
  .where('seasonId', '<', 'seasonId');
  if (pastLeagues === 0) {
    res.status(404).send();
    return;
  }

  //allow for updates
  let hofAll = await eight_nine_ball_leagues.query().where({
    type: type
  })
  if (hofAll === 0) {
    res.status(404).send();
    return;
  }

  //check for all entries in hofAll
  for (let j = 0; j < hofAll.length; j++ ) {
    locP, locC = -1;
    //get location of entry within hofAll
    for (let i = 0; i < pastLeagues; i++) {
    if (pastLeagues[i] === hofAll[j].staffName) {
      locP = i;
      break;
    }
  }F

    //calculate winrate for current league
    for (let i = 0; i < currentLeague; i++) {
      if (currentLeague[i] === hofAll[j].staffName) {
        locC = i;
        break;
      }
    }
    hofAll[j].improvementRate = (currentLeague[locC].wins * 100) / currentLeague[locC].plays;
    
    //calculate avg winrate for the rest of the leagues
    totalWins = 0;
    totalPlays = 0;
    for (let i = 0; i < pastLeagues; i++) {
      if (pastLeagues[i] === hofAll[j].staffName) {
        totalWins = totalWins + pastLeagues[i].win;
        totalPlays = totalPlays + pastLeagues[i].play;
      }
    }
    hofAll[j].improvement =  ((totalWins * 100) / totalPlays);
    
    //deduct: may want a better method of %
    hofAll[j].latestWins = hofAll[j].improvement = improvementRate;

  }

  
})

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
  //Add to DB if not exist
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

  /***************
   * Improvement *
   ***************/
  //TODO

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

/* 
  POST handler for /api/89ball_league/hall_of_fame/calculate
  Function: To add a fixture to the HoF table for consideration
  MUST BE RAN AFTER LEAGUE CALCULATION
*/
router.post("/updatehof", async (req, res) => {
  //key:
  //ac:topPlayer = code helpful to topPlayer
  //ach:topPlayer = code directly generating topPlayer

  type = parseInt(req.body.type, 10);
  //this is the fixture to be added into consideration
  score1 = parseInt(req.body.score1);
  score2 = parseInt(req.body.score2);
  player1 = req.body.player1;
  player2 = req.body.player2;
  seasonId = req.body.seasonId;

  let hofAll = await hall_of_fame.query().where({
    type: type
  });
  if (hofAll === 0) {
    res.status(404).send();
    return;
  }

  let topPlayer = _.maxBy(hofAll, "winRate"); //get top player now to see if they change

  let hof1, hof2;

  //no delete function here: make it it's own thing!
  //well there is, but only for testing
  const numberOfDeletedRows = await hall_of_fame
    .query()
    .delete()
    .where({
      type: type
    });
  console.log("deleted " + numberOfDeletedRows + " rows.");

  //check if p1 is already in the HoF. If not, add them. Set their values.
  const p1Present = await hall_of_fame.query().where({ staffName: player1 });
  if (p1Present.length === 0) {
    await knex("hall_of_fame").insert({
      staffName: player1,
      type: type
    });
    hof1 = await hall_of_fame.query().where({
      type: type,
      staffName: player1
    });

    hof1.wins = 0;
    hof1.plays = 0;
    hof1.highestPoints = 0;
    hof1.totalPoints = 0;
  } else {
    hof1 = await hall_of_fame.query().where({
      type: type,
      staffName: player1
    });
  }

  //check if p2 is already in the HoF. If not, add them. Set their values.
  const p2Present = await hall_of_fame.query().where({ staffName: player2 });
  if (p2Present.length === 0) {
    await knex("hall_of_fame").insert({
      staffName: player2,
      type: type
    });
    hof2 = await hall_of_fame.query().where({
      type: type,
      staffName: player2
    });

    hof2.wins = 0;
    hof2.plays = 0;
    hof2.highestPoints = 0;
    hof2.totalPoints = 0;
  } else {
    hof2 = await hall_of_fame.query().where({
      type: type,
      staffName: player2
    });
  }

  //make sure values have been found
  if (hof1.length === 0 || hof2.length === 0) {
    res.status(404).send();
    return;
  }

  let seasons = await eight_nine_ball_seasons.query().where({
    type: type
  });
  if (seasons === 0) {
    res.status(404).send();
  }

  //function for: ach:dedicated, ach:topPlayer, ach:drawRate, ach:avgPointsSeason, avgPoints
  hof1 = windrawGen.calcWinDraw(score1, score2, hof1, seasons.length);
  hof2 = windrawGen.calcWinDraw(score2, score1, hof2, seasons.length);

  currentLeague1 = await eight_nine_ball_leagues.query().where({
    type: type,
    staffName: player1,
    seasonId: seasonId
  });
  currentLeague2 = await eight_nine_ball_leagues.query().where({
    type: type,
    staffName: player2,
    seasonId: seasonId
  });
  if (currentLeague1.length === 0 || currentLeague2.length === 0) {
    res.status(404).send();
    return;
  }

  //check the current league and add scores for ach:bestSeason
  if (currentLeague1.points > hof1.highestPoints) {
    hof1.highestPoints = currentLeague1.points;
  }
  if (currentLeague2.points > hof2.highestPoints) {
    hof2.highestPoints = currentLeague2.points;
  }

  

  //get the latest winrate needed for ach:improver and ach:timeToRetire
  if (seasons.length > 1) {
    //TODO also need to check if this is the last fixture
  }

  //calculations for ac:scrappy
  let newTopPlayer = _.maxBy(hofAll, "winRate"); //get top player

  let fixtures = await eight_nine_ball_fixtures.query().where({
    type: type
  });
  if (fixtures === 0) {
    res.status(404).send;
  }

  /*let hofAll = await hall_of_fame.query().where({
    type: type,
  });
  if (hofAll === 0) {
    res.status(404).send;
  }*/

  if (newTopPlayer === topPlayer) {
    hof1 = scrappyGen.calculateScrappy(fixtures, hofAll, topPlayer.staffName, newTopPlayer.staffName, player1, player2, hof);
    hof2 = scrappyGen.calculateScrappy(fixtures, hofAll, topPlayer.staffName, newTopPlayer.staffName, player1, player2, hof);
  } else {
    hofAll = scrappyGen.calculateScrappy(fixtures, hofAll, topPlayer.staffName, newTopPlayer.staffName, player1, player2, hof)
  }
  //scrappyGen.calculateScrappy(fixtures, hofAll, topPlayer.staffName, newTopPlayer.staffName, player1, player2, hof)
  //if the topplayer is the same you just need to count the new values
  if (newTopPlayer === topPlayer) {
    if (player1 === topPlayer) {
      hof2.scrappyPlays++;
      if (score2 > score1) {
        hof2.scrappy++;
      }
    } else if (player2 === topPlayer) {
      hof1.scrappyPlays++;
      if (score1 > score2) {
        hof1.scrappy++;
      }
    }
  } else {
    //else, go through and recalculate everything
    let fixtures = await eight_nine_ball_fixtures.query().where({
      type: type
    });
    if (fixtures === 0) {
      res.status(404).send;
    }

    for (let i = 0; i < fixtures.length; i++) {
      let hofAll = await hall_of_fame.query().where({
        type: type
      });
      loc1, (loc2 = 0);

      //if player1 is the same as topPlayer, get its location and increment as necessary
      if (player1 === topPlayer) {
        for (let j = 0; j < hofAll.length; j++) {
          if (j === player2) {
            loc2 = j;
            break;
          }
        }
        //increment plays, then check if you should inc scrappy
        hofAll[loc2].scrappyPlays++;
        if (score2 > score1) {
          hofAll[loc2].scrappy++;
        }
      } else if (player2 === topPlayer) {
        for (let j = 0; j < hofAll.length; j++) {
          if (j === player1) {
            loc1 = j;
            break;
          }
        }
        hofAll[loc1].scrappyPlays++;
        if (score1 > score2) {
          hofAll[loc1].scrappy++;
        }
      }
    }

    //add the values to the database. don't forget to calculate scrappyRate for ach:scrappy
    for (let i = 0; i < hofAll.length; i++) {
      delete hofAll[i].id;
      hofAll[i].scrappyRate =
        (hofAll[i].scrappy * 100) / hofAll[i].scrappyPlays;
      await hall_of_fame
        .query()
        .findOne({
          type: type,
          staffName: hofAll[i].staffName
        })
        .patch(hofAll[i]);
    }
  }

  res.json(hof1);
});
//dr punctual
//train
//filthy casual
//slacker
//slump
//time to retire
module.exports = router;
