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

//{force: true} to start with clean table
db.sequelize.sync().then(function() {
  app.listen(PORT, () => {
    console.log("Express is listeing on port: " + PORT);
  });
});
