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

//GET 8 BALL LEAGUE
app.get("/api/8ball_league", (req, res) => {
  var where = {};

  db.eight_ball_league.findAll({ where: where }).then(
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
  var body = _.pick(req.body, "seasonId", "staffName");

  db.eight_ball_league.create(body).then(
    player => {
      res.json(player.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
});

//GET 8 BALL FIXTURE
app.get("/api/8ball_league/fixture", (req, res) => {
  var where = {};

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
  var body = _.pick(
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
app.put("/api/8ball_league/edit/fixture", (req, res) => {
  //Add fixtureId attributes later
  const body = _.pick(
    req.body,
    "seasonId",
    "player1",
    "score1",
    "player2",
    "score2"
  );

  const Attributes = {
    seasonId: body.seasonId,
    //fixtureId: body.fixtureId
    player1: body.player1,
    score1: body.score1,
    player2: body.player2,
    score2: body.score2
  };

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
//REQUIRES: season ID input.
//TODO: has to provide separate fixture ids
      //Doable with n!/(k!*((n-k)!). Calculate how many rows will be needed, then divide this to reach a suitable value.
//TODO: possible error - occasionally cannot access player2 column. unable to replicate.
app.post("/api/8ball_league/generate/fixture", (req, res) => {
  let ctt;
  var seasonID = req.body.season;

  //count rows and store this in ctt
  db.eight_ball_league.count().then(c => {
    console.log("There are " + c + " projects!");
    ctt = c;
  }).then(() => {

    //get staff names and store these in results[n].staffName
    db.eight_ball_league.findAll({
      attributes: ['staffName']
    }).then(function(results) {
      
      //loop from 0 to max, setting the staff names on the fixture as is appropriate
      console.log('the count is ' + ctt);
      for (var i = 0; i < ctt; i++) {
        for (var j = i + 1; j < ctt; j++) {
          let notes = [
            { seasonId: seasonID, fixtureId: '1', player1: results[i].staffName, player2: results[j].staffName} //occasionally can't access player2?
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

//{force: true} to start with clean table
db.sequelize.sync().then(function() {
  app.listen(PORT, () => {
    console.log("Express is listening on port: " + PORT);
  });
});
