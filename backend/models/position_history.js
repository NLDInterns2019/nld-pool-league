const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class position_history extends Model {
  static get tableName() {
    return "position_history";
  }
}

module.exports = position_history;