const express = require("express");
const bodyParser = require("body-parser");
const _ = require("underscore");
const cors = require("cors");
const db = require("./db.js");

//REMEMBER TO CHECK THE PORT
const PORT = process.env.PORT || 3000;
const app = express();
//TEST

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Nonlinear Pool Manager Backend");
});

//GET 8 BALL SEASONS (for the seasons list)
app.get("/api/8ball_season", (req, res) => {
  db.eight_ball_leagues
    .aggregate("SeasonId", "DISTINCT", { plain: false })
    .then(
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

//GET ALL 8 BALL LEAGUE
app.get("/api/8ball_league", (req, res) => {
  let where = {};

  //ordering: order season ID descending. then order by descending points. then by descending wins. then descending goalsfor. then ascending goals against.
  //eg: two users with identical id's, points and wins will be decided by who scored the highest cumilatively against other players.
  db.eight_ball_leagues.findAll({where: where, order: [['seasonId', 'desc'],['points','desc'], ['win', 'desc'], ['goalsFor', 'desc'],['goalsAgainst', 'asc']]}).then(
    players => {
      res.json(players);
    },
    e => {
      res.status(400).send();
    }
  );
});

//GET SPECIFIC 8 BALL LEAGUE
app.get("/api/8ball_league/:seasonId", (req, res) => {
  let seasonId;

  if (req.params.seasonId) seasonId = parseInt(req.params.seasonId, 10);

  db.eight_ball_leagues.findAll({ where: { seasonId: seasonId }, order: [['points', 'desc'], ['win', 'desc'], ['goalsFor', 'desc'],['goalsAgainst', 'asc']]}).then(
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

  db.eight_ball_leagues.create(body).then(
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

//GET ALL 8 BALL FIXTURE
app.get("/api/8ball_fixture", (req, res) => {
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

//GET SPECIFIC 8 BALL FIXTURE
app.get("/api/8ball_fixture/:seasonId", (req, res) => {
  let seasonId;

  if (req.params.seasonId) seasonId = parseInt(req.params.seasonId, 10);

  db.eight_ball_fixtures.findAll({ where: { seasonId: seasonId } }).then(
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

//WILL ONLY HANDLE ONE SEASON
//PUT 8 BALL, UPDATE LEAGUE AND FIXTURES
app.put("/api/8ball_league/edit/fixture", (req, res) => {
  //add fixtureID attributes later
  const body = _.pick(
    req.body,
    "seasonId",
    "player1",
    "score1",
    "player2",
    "score2"
  );

  //attributes for fixture
  const Attributes = {
    seasonId: body.seasonId,
    //fixtureId: body.fixtureId
    player1: body.player1,
    score1: body.score1,
    player2: body.player2,
    score2: body.score2
  };
  let lgAttributes1, lgAttributes2;

  db.eight_ball_leagues
    .findOne({
      where: {
        seasonId: Attributes.seasonId,
        staffName: Attributes.player1
      }
    }).then(function(results) {
      let leagueRow1 = results; //leaguerow1 contains the league row for player1
      db.eight_ball_leagues
        .findOne({
          where: {
            seasonId: Attributes.seasonId,
            staffName: Attributes.player2
          }
        })
        .then(function(results) {
          let leagueRow2 = results;
          if (Attributes.score1 > Attributes.score2) {
            //see who won and increment/decrement as appropriate
            leagueRow1.win++;
            leagueRow2.lost++;
          } else if (Attributes.score1 < Attributes.score2) {
            leagueRow1.lost++;
            leagueRow2.win++;
          } else {
            leagueRow1.draw++;
            leagueRow2.draw++;
          }

          //points are calculated with goalsFor and wins (i think) - this will be DIFFERENT for billiards (goalsFor-goalsAgainst)
          leagueRow1.points =
            parseInt(leagueRow1.win) +
            parseInt(leagueRow1.goalsFor) +
            parseInt(Attributes.score1);
          leagueRow2.points =
            parseInt(leagueRow2.win) +
            parseInt(leagueRow2.goalsFor) +
            parseInt(Attributes.score2);

          //get new values for player 1 league row
          lgAttributes1 = {
            played: leagueRow1.played + 1,
            win: leagueRow1.win,
            draw: leagueRow1.draw,
            lost: leagueRow1.lost,
            goalsFor:
              parseInt(leagueRow1.goalsFor) + parseInt(Attributes.score1),
            goalsAgainst:
              parseInt(leagueRow1.goalsAgainst) + parseInt(Attributes.score2),
            points: leagueRow1.points
          };
          lgAttributes2 = {
            //and for player 2
            played: leagueRow2.played + 1,
            win: leagueRow2.win,
            draw: leagueRow2.draw,
            lost: leagueRow2.lost,
            goalsFor:
              parseInt(leagueRow2.goalsFor) + parseInt(Attributes.score2),
            goalsAgainst:
              parseInt(leagueRow2.goalsAgainst) + parseInt(Attributes.score1),
            points: leagueRow2.points
          };
        })
        .then(
          db.eight_ball_leagues
            .findOne({
              where: {
                seasonId: Attributes.seasonId,
                staffName: Attributes.player1
              }
            })
            .then(
              league => {
                if (league) {
                  league.update(lgAttributes1).then(e => {
                    //FIX THESE WHEN - NEED transactions otherwise any errors will ruin everything
                    //league found but update failed
                    //res.status(400).json(e);
                  });
                } else {
                  //league not found
                  res.status(404).send();
                }
              },
              e => {
                //Error
                res.status(500).send();
              }
            )
        )
        .then(
          db.eight_ball_leagues
            .findOne({
              where: {
                seasonId: Attributes.seasonId,
                staffName: Attributes.player2
              }
            })
            .then(
              league => {
                //do player 2 now
                if (league) {
                  league.update(lgAttributes2).then(
                    result => {
                      //  res.json(result.toJSON());
                    },
                    e => {
                      //league found but somethow update fail
                      res.status(400).json(e);
                    }
                  );
                } else {
                  //league not found
                  res.status(404).send();
                }
              }
              // e => {
              //Error
              //   res.status(500).send();
              // }
            )
            .then(
              //don't forget to update the fixtures
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
                          //Fixture found but update failed
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
                )
            )
        );
    });
});

//AUTOMATICALLY GENERATE FIXTURES - RUN WHEN ALL USERS ARE ADDED TO THE LEAGUE TABLE
//REQUIRES: season ID input. Populated league table.
//TODO: has to provide separate fixture ids
//There will be as many fixtures as there are players. Players must feature once in each fixture.
app.post("/api/8ball_league/generate/fixture", (req, res) => {
  const body = _.pick(req.body, "seasonId");
  let ctt;

  let seasonID = body.seasonId;
  //count league rows and store this in ctt
  db.eight_ball_leagues
    .count({ where: { seasonId: seasonID } })
    .then(c => {
      console.log("There are " + c + " projects!");
      ctt = c;
    })
    .then(() => {
      //get staff names and store these in results[n].staffName
      db.eight_ball_leagues
        .findAll({
          attributes: ["staffName"],
          where: { seasonId: seasonID }
        })
        .then(function(results) {
          //loop from 0 to max, setting the staff names on the fixture as is appropriate
          console.log("the count is " + ctt);
          for (let i = 0; i < ctt; i++) {
            for (let j = i + 1; j < ctt; j++) {
              for (let x = 1; x <= ctt; x++) {}
              let notes = [
                {
                  seasonId: seasonID,
                  player1: results[i].staffName,
                  player2: results[j].staffName
                }
              ];
              db.eight_ball_fixtures
                .bulkCreate(notes, { validate: true })
                .then(() => {
                  console.log("Fixtures generated.");
                })
                .catch(err => {
                  console.log("Failed to generate fixtures.");
                  console.log(err);
                });
            }
          }
        });
    })
    .then(() => {
      res.status(200).send();
    });
});

//return lowest fixture not already containing the player
//used for fixture division
function suitableFixture(leagueId, name, maxCount) {
  for (let fixt = 1; fixt <= maxCount; fixt++) {
    return db.Profile.count({
      where: { leagueId: leagueId, player1: name }
    }).then(count => {
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
