const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class eight_nine_ball_fixtures extends Model {
  static get tableName() {
    return "eight_nine_ball_fixtures";
  }

  static get relationMapping() {
    return {
      player1: {
        relation: Model.BelongsToOneRelation,
        modelClass: eight_nine_ball_leagues,
        join: {
          from: ["eight_nine_ball_fixtures.seasonId", "eight_nine_ball_fixtures.player1"],
          to: ["eight_nine_ball_leagues.seasonId", "eight_nine_ball_leagues.staffName"]
        }
      },
      player2: {
        relation: Model.BelongsToOneRelation,
        modelClass: eight_nine_ball_leagues,
        join: {
          from: ["eight_nine_ball_fixtures.seasonId", "eight_nine_ball_fixtures.player2"],
          to: ["eight_nine_ball_leagues.seasonId", "eight_nine_ball_leagues.staffName"]
        }
      }
    };
  }
}

module.exports = eight_nine_ball_fixtures;
