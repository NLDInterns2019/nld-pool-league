process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const scrappyGen = require("../functions/addscrappy");
const knex = require("../db/knex");
const _ = require("lodash");

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
      it("should properly calculate scrappyRate for one player", async() => {
         //PREP
         let fixtures = (
          {id: 1, type: 8, seasonId: 100 , player1: "Andy", score1: 2, player2: "Mal", score2: 0, group: 0, },
          {id: 2, type: 8, seasonId: 100 , player1: "Andy", score1: 0, player2: "Chris", score2: 2, group: 0 },
          {id: 3, type: 8, seasonId: 100 , player1: "Mal", score1: 2, player2: "Chris", score2: 0, group: 0},
          {id: 4, type: 8, seasonId: 100 , player1: "Winston", score1: 2, player2: "Andy", score2: 0, group: 0});
          
          hof = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }

         //ACT
         hof = scrappyGen.calculateScrappy("Andy", player1, player2, hof);
         let topScrappy = _.maxBy(hof, "scrappy"); 
         console.log(hof + "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")

        //ASSERT
        expect(topScrappy.staffName).to.eql("Chris"); 
      });
})