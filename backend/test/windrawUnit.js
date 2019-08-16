process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const windraw = require("../functions/windraw");
const knex = require("../db/knex");

const hall_of_fame = require("../models/hall_of_fame");

describe("windraw()", () => {
    beforeEach(function(done) {
        knex.migrate
          .rollback()
          .then(() => knex.migrate.latest())
          .then(() => knex.seed.run())
          .then(() => done())
          .catch(done);
    });
    it("should calculate a match with a winner", async() => {
       
      //PREP
      hof1 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0 }

      hofGoal1 = {wins: 1, draws: 0, loss: 0, plays: 1, winRate: 100, drawRate: 0 }
      score1 = 2;
      score2 = 0;
      //ACT
      hof1 = windraw.calcWinDraw(score1, score2, hof1);

      //ASSERT
      expect(hof1).to.eql(hofGoal1); 
    })
    it("should calculate a match with a loser", async() => {
       
        //PREP
       hof2 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0 }
       hofGoal2 = {wins: 0, draws: 0, loss: 1, plays: 1, winRate: 0, drawRate: 0 }
       score1 = 2;
       score2 = 0;

        //ACT
       hof2 = windraw.calcWinDraw(score2, score1, hof2);

       //ASSERT
       expect(hof2).to.eql(hofGoal2); 
   })
   it("should calculate a match with a draw", async() => {
       
    //PREP
   hof1 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0 }
   hof2 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0 }

   hofGoal1 = {wins: 0, draws: 1, loss: 0, plays: 1, winRate: 0, drawRate: 100 }
   hofGoal2 = {wins: 0, draws: 1, loss: 0, plays: 1, winRate: 0, drawRate: 100 }
   score1 = 1;
   score2 = 1;
    //ACT
   hof1 = windraw.calcWinDraw(score1, score2, hof1);
   hof2 = windraw.calcWinDraw(score2, score1, hof2);

   //ASSERT
   expect(hof1).to.eql(hofGoal1); 
   expect(hof2).to.eql(hofGoal2); 
})
});