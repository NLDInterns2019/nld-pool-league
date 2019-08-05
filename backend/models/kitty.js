const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class kitty extends Model {
  static get tableName() {
    return "kitty";
  }
}

module.exports = kitty;
