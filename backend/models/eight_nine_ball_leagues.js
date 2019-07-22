const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class eight_nine_ball_leagues extends Model {
  static get tableName() {
    return "eight_nine_ball_leagues";
  }

  static get relationMapping() {
    return {
      player1: {
        relation: Model.HasManyRelation,
        modelClass: eight_nine_ball_fixtures,
        join: {
          from: ["eight_nine_ball_leagues.seasonId", "eight_nine_ball_leagues.staffName"],
          to: ["eight_nine_ball_fixtures.seasonId", "eight_nine_ball_fixtures.player1"]
        }
      },
      player2: {
        relation: Model.HasManyRelation,
        modelClass: eight_nine_ball_fixtures,
        join: {
          from: ["eight_nine_ball_leagues.seasonId", "eight_nine_ball_leagues.staffName"],
          to: ["eight_nine_ball_fixtures.seasonId", "eight_nine_ball_fixtures.player2"]
        }
      },
      season: {
        relation: Model.BelongsToOneRelation,
        modelClass: eight_nine_ball_seasons,
        join: {
          from: ["eight_nine_ball_leagues.seasonId", "eight_nine_ball_leagues.type"],
          to: ["eight_nine_ball_seasons.seasonId", "eight_nine_ball_seasons.staffName"]
        }
      },
    };
  }
}

module.exports = eight_nine_ball_leagues;
