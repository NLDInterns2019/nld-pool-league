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

app.get("/api/staff", (req, res) => {
  var where = {};

  db.staff.findAll({ where: where }).then(
    staffs => {
      res.json(staffs);
    },
    e => {
      res.status(400).send();
    }
  );
});

//POST STAFf
app.post("/api/staff", (req, res) => {
  var body = _.pick(req.body, "id", "name");

  db.staff.create(body).then(
    staff => {
      res.json(staff.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
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
app.post("/api/8ball_league/player", (req, res) => {
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

//POST 8 BALL GAME
app.post("/api/8ball_league/fixture/", (req, res) => {
  var body = _.pick(req.body, "seasonId", "fixtureId", "score1", "player1", "player2", "score2");

  db.eight_ball_fixtures.create(body).then(
    fixture => {
      res.json(fixture.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
});

//{force: true} to start with clean table
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, () => {
    console.log("Express is listeing on port: " + PORT);
  });
});
