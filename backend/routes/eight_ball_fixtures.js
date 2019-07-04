var express = require('express');
var router = express.Router();

const eight_ball_fixtures = require('../models/eight_ball_fixtures');

/* 
  POST handler for /api/8ball_fixtures
  Function: Displays fixtures
*/
router.get("/", function (req,res) {
    eight_ball_fixtures.query()
    .then(fixture => {
      res.json(fixture)
    }, e => {
      res.status(400).json(e);
    })
})
/*
  eight_ball_leagues
    .query()
    .insert({ seasonId: body.seasonId, staffName: body.staffName })
    .then(
      player => {
        res.json(player);
      },
      e => {
        res.status(404).json(e);
      }
    );
});

/* 
  !!!!!!!!!!UNTESTED!!!!!!!!!!
  POST handler for /api/8ball_fixtures/add/fixture_row
  Function: Adds a row to a fixture. Does not update league table.
*/
app.post("/add/fixture_row", (req, res) => {
    const body = _.pick(req.body, "seasonId", "score1", "player1", "player2", "score2");
    const schema = {
        seasonId: Joi.string().required(),
        score1: Joi.number(),
        player1: Joi.string().required(),
        player2: Joi.string().required(),
        score2: Joi.number()
    }
    //Validation
    if (Joi.validate(body, schema, { convert: false }).error) {
        res.status(400).json({ status: 'error', error: 'Invalid data' })
        return
    }
    //add
    eight_ball_fixtures
        .query()
        .patch({
            score1: score1,
            score2: score2
        })
        .where(
            'seasonId', ':',  seasonId,
            'player1', ':', player1,
            'player2', ':', player2
        ), e => {
            res.status(400).json
        }
  });

module.exports = router;