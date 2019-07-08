const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class eight_ball_leagues extends Model {
  static get tableName() {
    return "eight_ball_leagues";
  }

  static get relationMapping() {
    return {
      player1: {
        relation: Model.HasManyRelation,
        modelClass: eight_ball_fixtures,
        join: {
          from: ["eight_ball_leagues.seasonId", "eight_ball_leagues.staffName"],
          to: ["eight_ball_fixtures.seasonId", "eight_ball_fixtures.player1"]
        }
      },
      player2: {
        relation: Model.HasManyRelation,
        modelClass: eight_ball_fixtures,
        join: {
          from: ["eight_ball_leagues.seasonId", "eight_ball_leagues.staffName"],
          to: ["eight_ball_fixtures.seasonId", "eight_ball_fixtures.player2"]
        }
      }
    };
  }
}

module.exports = eight_ball_leagues;
