var express = require("express");
var router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");
var token = require("../test/function/token");
var axios = require("axios");

const position_history = require("../models/position_history");

/* 
  GET handler for /api/position_history
  Function: To get all the 8/9 ball seasons
*/
router.get("/", (req, res) => {
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

  position_history
    .query()
    .where(where)
    .then(
      seasons => {
        res.json(seasons);
      },
      e => {
        res.status(400).json(e);
      }
    );
});

module.exports = router;
