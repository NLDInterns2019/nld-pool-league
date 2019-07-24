const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class hall_of_fame extends Model {
  static get tableName() {
    return "hall_of_fame";
  }
}

module.exports = hall_of_fame;