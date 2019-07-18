const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class bookings extends Model {
  static get tableName() {
    return "bookings";
  }
}

module.exports = bookings;
