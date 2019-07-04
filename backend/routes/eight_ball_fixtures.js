var express = require('express');
var router = express.Router();

const eight_ball_fixtures = require('../models/eight_ball_fixtures');

router.get("/", function (req,res) {
    // response = knex.select().from('eight_ball_fixtures')
    // .then(function(fixtures){
    //     res.json(fixtures)
    // })

    eight_ball_fixtures.query()
    .then(fixture => {
      res.json(fixture)
    }, e => {
      res.status(400).json(e);
    })
})

/*router.get("/", (req, res) => {
  eight_ball_leagues.query()
  .then(players => {
    res.json(players)
  }, e => {
    res.status(400).json(e);
  })
});*/
/*
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
*/
module.exports = router;