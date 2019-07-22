const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class eight_nine_ball_seasons extends Model {
  static get tableName() {
    return "eight_nine_ball_seasons";
  }

  static get relationMapping() {
    return {
      season: {
        relation: Model.HasManyRelation,
        modelClass: eight_nine_ball_leagues,
        join: {
          from: ["eight_nine_ball_seasons.seasonId", "eight_nine_ball_seasons.type"],
          to: ["eight_nine_ball_leagues.seasonId", "eight_nine_ball_leagues.player1"]
        }
      },
    };
  }
}

module.exports = eight_nine_ball_seasons;
