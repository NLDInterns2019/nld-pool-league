process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const scrappy = require("../functions/scrappy");
const knex = require("../db/knex");

const hall_of_fame = require("../models/hall_of_fame");

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
        },
        {
          id: 4,
          type: 8,
          seasonId: 100,
          player1: "Winston",
          score1: 2,
          player2: "Andy",
          score2: 0,
          group: 0
        });
      });
      it("should properly calculate scrappyRate for one player", async() => {
        // //PREP
        // topPlayer = "Andy";
        // let hofAll = await hall_of_fame.query().where({
        //   type: type
        // });
        // //ACT
        // scrappyVal = scrappy.generateScrappy(fixtures, hofAll, topPlayer, i);
        // players = polygon.polygonShuffle(players);

        //ASSERT
       // expect(scrappyVal).to.eql(expPlayers); 
    })
});