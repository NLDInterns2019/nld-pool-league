var express = require("express");
var router = express.Router();
const Joi = require("joi");
const knex = require("../db/knex");
const auth = require("../auth");
const moment = require("moment");

const bookings = require("../models/bookings");

module.exports = router;