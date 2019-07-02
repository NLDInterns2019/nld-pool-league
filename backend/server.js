const express = require("express");
const bodyParser = require("body-parser");
const _ = require("underscore");
const cors = require("cors");
const db = require("./db.js");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Nonlinear Pool Manager Backend");
});

//GET 8 BALL SEASONS (for the seasons list)
app.get("/api/8ball_season", (req, res) => {
  db.eight_ball_seasons.findAll({ where: {} }).then(
    seasons => {
      res.json(seasons);
    },
    e => {
      res.status(400).send();
    }
  );
});

//POST 8 BALL SEASONS (add new seasons)
app.get("/api/8ball_season/add/seasons", (req, res) => {
  let body = _.pick(req.body, "seasonId");

  db.eight_ball_seasons.create(body).then(
    season => {
      res.json(season.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
});

//GET 8 BALL LEAGUE
app.get("/api/8ball_league", (req, res) => {
  let where = {};

  db.eight_ball_leagues.findAll({ where: where }).then(
    players => {
      res.json(players);
    },
    e => {
      res.status(400).send();
    }
  );
});

//POST 8 BALL PLAYER
app.post("/api/8ball_league/add/player", (req, res) => {
  let body = _.pick(req.body, "seasonId", "staffName");

  db.eight_ball_leaguess.create(body).then(
    player => {
      res.json(player.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
});

//DELETE 8 BALL PLAYER
app.delete("/api/8ball_league/delete/player", (req, res) => {
  let body = _.pick(req.body, "seasonId", "staffName");
  let attributes = {
    seasonId: body.seasonId,
    staffName: body.staffName
  };

  db.eight_ball_leagues
    .destroy({
      where: attributes
    })
    .then(
      result => {
        if (result === 0) {
          res.status(404).json();
        } else {
          res.status(204).send();
        }
      },
      e => {
        res.status(500).send();
      }
    );
});

//GET 8 BALL FIXTURE
app.get("/api/8ball_league/fixture", (req, res) => {
  let where = {};

  db.eight_ball_fixtures.findAll({ where: where }).then(
    fixtures => {
      res.json(fixtures);
    },
    e => {
      res.status(400).send();
    }
  );
});

//POST 8 BALL GAME IN THE FIXTURE
app.post("/api/8ball_league/add/fixture_row", (req, res) => {
  let body = _.pick(
    req.body,
    "seasonId",
    "fixtureId",
    "score1",
    "player1",
    "player2",
    "score2"
  );

  db.eight_ball_fixtures.create(body).then(
    fixture => {
      res.json(fixture.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
});

//PUT 8 BALL EDIT SCORE IN FIXTURE
//needs to set suitable variables according to the league values
app.put("/api/8ball_league/edit/fixture", (req, res) => {
  //Add fixtureId attributes later
  /*when a match is added:
for each name:
	increment P
	if loss: increment L
	if win: increment w
	if draw: increment D
	increment F by their score
	increment A by the others score
	add F and W for points
*/

  console.log(results);
  const body = _.pick(
    req.body,
    "seasonId",
    "player1",
    "score1",
    "player2",
    "score2"
  );

  console.log("WWWWWWW");
  db.eight_ball_leagues.findAll({
   where: {
     staffName: body.player1
   }
  }).then(function(results) {
    console.log(results)
  });

  const Attributes = {
    seasonId: body.seasonId,
    //fixtureId: body.fixtureId
    player1: body.player1,
    score1: body.score1,
    player2: body.player2,
    score2: body.score2
  };
  //FIRST: get all the values usable from the league table
  //ignore everything else

  db.eight_ball_leagues
   .findOne({
     where: {
       seasonId: body.seasonId,
       //fixtureId: body.fixtureId,
       staffName: body.player1
     }
   }). then (
     console.log(result)
   )

  //contains attributes to be given to player1
  //inc P
  //inc L D or W depending on result
  //inc F by w+d
  //ind a by l
  //add f and w for points
  const lgAttributes1 = {
    seasonId: body.seasonId,
    //fixtureId: body.fixtureId,
    w: body.player1 //plus the value within the league table
  }

  //contains attributes to be given to player2
  const lgAttributes2 = {
    seasonId: body.seasonId,
    //fixtureId: body.fixtureId,
    w: body.player
  }

  db.eight_ball_fixtures
    .findOne({
      where: {
        seasonId: body.seasonId,
        //fixtureId: body.fixtureId,
        player1: body.player1,
        player2: body.player2
      }
    })
    .then(
      fixture => {
        if (fixture) {
          fixture.update(Attributes).then(
            result => {
              res.json(result.toJSON());
            },
            e => {
              //Fixture found but somethow update fail
              res.status(400).json(e);
            }
          );
        } else {
          //Fixture not found
          res.status(404).send();
        }
      },
      e => {
        //Error
        res.status(500).send();
      }
    
  );
});

//AUTOMATICALLY GENERATE FIXTURES - RUN WHEN ALL USERS ARE ADDED TO THE LEAGUE TABLE
//REQUIRES: season ID input. Populated league table.
//TODO: has to provide separate fixture ids
      //There will be as many fixtures as there are players. Players must feature once in each fixture.
//TODO: possible error - occasionally cannot access player2 column. unable to replicate.
app.post("/api/8ball_league/generate/fixture", (req, res) => {
  let ctt;
  //let seasonID = req.body.season;
  let seasonID = 11;
  let fixID = 0;
  //count league rows and store this in ctt
  db.eight_ball_leagues.count().then(c => {
    console.log("There are " + c + " projects!");
    ctt = c;
  }).then(() => {

    //get staff names and store these in results[n].staffName
    db.eight_ball_leagues.findAll({
      attributes: ['staffName']
    }).then(function(results) {
      //get total combinations (order unimportant)
     // totalRows = factorial(ctt)/2*(factorial(ctt-2)); // n!/(k!*((n-k)!)

      //determine the boundaries for splitting fixtures. each player means a new fixture to ensure nobody plays more than once a week.
      //unable to do this algorithmically
      //before each insert, check for fixtures with a value of 1-5
      //check fixture for matching names for player1 or player2 
      //if no match, set fixtureid to the loop value


      //loop from 0 to max, setting the staff names on the fixture as is appropriate
      console.log('the count is ' + ctt);
      for (let i = 0; i < ctt; i++) {
        for (let j = i + 1; j < ctt; j++) {
          for (let x = 1; x<=ctt; x++) {

          }
          let notes = [
            { seasonId: seasonID, fixtureId: fixID, player1: results[i].staffName, player2: results[j].staffName}
          ];
            db.eight_ball_fixtures.bulkCreate(notes, { validate: true }). then(() => {
              console.log('Fixtures generated.');
            }).catch((err) => {
              console.log('Failed to generate fixtures.');
              console.log(err);
            });
        };
      }
    });
  });
})

//return lowest fixture not already containing the player
//used for fixture division
function suitableFixture (leagueId, name, maxCount) {
  for (let fixt = 1; fixt <= maxCount; fixt++) {
    return db.Profile.count({ where: { leagueId: leagueId, player1: name } })
      .then(count => {
        if (count === 0) {
          return fixt;
        }
        return maxCount;
    });
    //check player1 and player2 of rows matching the leagueid and fixid do not contain
  }
}

//{force: true} to start with clean table
db.sequelize.sync().then(function() {
  app.listen(PORT, () => {
    console.log("Express is listening on port: " + PORT);
  });
});
