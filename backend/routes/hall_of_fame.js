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
  })
   console.log("deleted " + numberOfDeletedRows + " rows.")

  knex('hall_of_fame')
  .where('type', 9)
  .del()

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
    //hofRow.winRate = Math.trunc((hofRow.wins * 100) / hofRow.plays);

    let seasons = await eight_nine_ball_seasons.query().where({type: type});

    if (hofRow.plays !== 0) {
      hofRow.drawRate = Math.trunc((hofRow.draws * 100) / hofRow.plays);
      hofRow.punctRate = Math.trunc((hofRow.punctRate * 100) / hofRow.plays);
      hofRow.lossRate = Math.trunc((hofRow.loss * 100) / hofRow.plays);
      hofRow.avgPoints = parseFloat(hofRow.totalPoints / hofRow.plays).toFixed(2); //seasons.length
      hofRow.avgPointsSeason = parseFloat(hofRow.totalPoints / seasons.length).toFixed(2);
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
        parseInt(hofRow.improvementRate) - parseInt((hofRow.wins * 100)/hofRow.plays);

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
  Function: To add a fixture to the HoF table for consideration
  MUST BE RAN AFTER LEAGUE CALCULATION
*/
router.post("/updatehof", async (req, res) => {
  //key:
  //ac:topPlayer = code helpful to topPlayer
  //ach:topPlayer = code directly generating topPlayer

  type = parseInt(req.body.type, 10);
  //this is the fixture to be added into consideration
  score1 = parseInt(req.body.score1)
  score2 = parseInt(req.body.score2)
  player1 = req.body.player1
  player2 = req.body.player2
  seasonId = req.body.seasonId

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
  })
   console.log("deleted " + numberOfDeletedRows + " rows.")

  //check if p1 is already in the HoF. If not, add them. Set their values.
  const p1Present = await hall_of_fame.query().where({staffName: player1})
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
  const p2Present = await hall_of_fame.query().where({staffName: player2})
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
    hof2.totalPoints = 0
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
  
  //function for: ach:dedicated, ach:topPlayer, ach:drawRate
  hof1 = windrawGen.calcWinDraw(score1, score2, hof1);
  hof2 = windrawGen.calcWinDraw(score2, score1, hof2);

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
    hof1.highestPoints = currentLeague1.points
  }
  if (currentLeague2.points > hof2.highestPoints) {
    hof2.highestPoints = currentLeague2.points
  }

  //get seasons: needed for ac:GPA
  let seasons = await eight_nine_ball_seasons.query().where({
    type: type
  });

  //get the latest winrate needed for ach:improver and ach:timeToRetire
  if (seasons.length > 1) {//TODO also need to check if this is the last fixture

  }

  //increment totalPoints and divide for ach:GPA and avgPoints in dashboard
  hof1.totalPoints = hof1.totalPoints + score1;
  hof2.totalPoints = hof2.totalPoints + score2;
  hof1.avgPointsSeason = hof1.totalPoints/seasons;
  hof2.avgPointsSeason = hof2.totalPoints/seasons;
  hof1.avgPoints = hof1.totalPoints/hof1.plays;
  hof2.avgPoints = hof2.totalPoints/hof2.plays;

  //calculations for ac:scrappy
  let newTopPlayer = _.maxBy(hofAll, "winRate"); //get top player
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
  } else { //else, go through and recalculate everything
    let fixtures = await eight_nine_ball_fixtures.query().where({
      type: type
    });
    if (fixtures === 0) {
      res.status(404).send;
    }

    for (let i = 0; i < fixtures.length; i++) {
      let hofAll = await hall_of_fame.query().where({
        type: type,
      });
      loc1, loc2 = 0;

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
      hofAll[i].scrappyRate = (hofAll[i].scrappy * 100) / hofAll[i].scrappyPlays;
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
