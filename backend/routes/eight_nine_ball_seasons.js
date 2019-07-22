var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const auth = require("../auth");

const eight_nine_ball_seasons = require("../models/eight_nine_ball_seasons");

/* 
  GET handler for /api/89ball_season
  Function: To get all the 8/9 ball seasons
*/
router.get("/", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type })
    .then(
      seasons => {
        res.json(seasons);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/89ball_season/latest
  Function: To get all the latest season
*/
router.get("/latest", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type })
    .max("seasonId as seasonId")
    .then(
      season => {
        res.json(season);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  DELETE handler for /api/89ball_season/delete/
  Function: To delete seasons (NOTE YET IMPLEMENTED IN THE UI)
*/
router.delete("/delete", auth.checkJwt, (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_seasons
    .query()
    .delete()
    .where({ type: req.body.type, seasonId: req.body.seasonId })
    .then(
      result => {
        if (result === 0) {
          //Nothing deleted
          res.status(404).json();
        } else {
          //Something deleted
          res.status(204).send();
        }
      },
      e => {
        //Internal error
        res.status(500).send();
      }
    );
});

/* 
  PUT handler for /api/89ball_season/close
  Function: To close a season
*/
router.put("/close", auth.checkJwt, (req, res) => {
  const schema = {
    type: Joi.number()
      .integer()
      .required(),
    seasonId: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.body, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  eight_nine_ball_seasons
    .query()
    .findOne({ type: req.body.type, seasonId: req.body.seasonId })
    .patch({ finished: true })
    .then(
      result => {
        if (result === 0) {
          res.status(404).send();
          return;
        }
        res.json(result);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

/* 
  GET handler for /api/89ball_season/:seasonId
  Function: To get specific season finished status
*/
router.get("/:seasonId", (req, res) => {
  req.query.type = parseInt(req.query.type, 10);
  const schema = {
    type: Joi.number()
      .integer()
      .required()
  };

  //Validation
  if (Joi.validate(req.query, schema, { convert: false }).error) {
    res.status(400).json({ status: "error", error: "Invalid data" });
    return;
  }

  let seasonId = parseInt(req.params.seasonId, 10);

  eight_nine_ball_seasons
    .query()
    .where({ type: req.query.type, seasonId: seasonId})
    .then(
      season => {
        if(season.lenght === 0){
          res.status(404).json(e);
        }
        res.json(season);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

module.exports = router;
