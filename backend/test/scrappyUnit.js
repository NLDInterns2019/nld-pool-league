const expect = require("chai").expect;
process.env.NODE_ENV = "test";
const scrappy = require("../functions/scrappy");
const fixture = require("../functions/fixturegen");

describe("scrappy()", () => {
    beforeEach(function(done) {
        knex.migrate
          .rollback()
          .then(() => knex.migrate.latest())
          .then(() => knex.seed.run())
          .then(() => done())
          .catch(done);
    });
    beforeEach(() => {
        fixtures = ({
          id: 1,
          type: 8,
          seasonId: 100,
          player1: "Andy",
          score1: 2,
          player2: "Mal",
          score2: 0,
          group: 0,
        },
        {
          id: 2,
          type: 8,
          seasonId: 100,
          player1: "Andy",
          score1: 2,
          player2: "Chris",
          score2: 0,
          group: 0
        },
        {
          id: 3,
          type: 8,
          seasonId: 100,
          player1: "Mal",
          score1: 2,
          player2: "Chris",
          score2: 0,
          group: 0
        });
      });
});