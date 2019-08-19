process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const windraw = require("../functions/windraw");
const knex = require("../db/knex");

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
      hof1 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }
      hofGoal1 = {wins: 1, draws: 0, loss: 0, plays: 1, winRate: 100, drawRate: 0, totalPoints: 2, avgPoints: 2, avgPointsSeason: 1 }
      score1 = 2;
      score2 = 0;

      //ACT
      hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);

      //ASSERT
      expect(hof1).to.eql(hofGoal1); 
    })
    it("should calculate a match with a loser", async() => {
       
        //PREP
       hof2 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }
       hofGoal2 = {wins: 0, draws: 0, loss: 1, plays: 1, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }
       score1 = 2;
       score2 = 0;

        //ACT
       hof2 = windraw.calcWinDraw(score2, score1, hof2, 2);

       //ASSERT
       expect(hof2).to.eql(hofGoal2); 
   })
   it("should calculate a match with a draw", async() => {
       
    //PREP
   hof1 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }
   hof2 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }

   hofGoal1 = {wins: 0, draws: 1, loss: 0, plays: 1, winRate: 0, drawRate: 100, totalPoints: 1, avgPoints: 1, avgPointsSeason: 0.5 }
   hofGoal2 = {wins: 0, draws: 1, loss: 0, plays: 1, winRate: 0, drawRate: 100, totalPoints: 1, avgPoints: 1, avgPointsSeason: 0.5 }
   score1 = 1;
   score2 = 1;
    //ACT
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);
   hof2 = windraw.calcWinDraw(score2, score1, hof2, 2);

   //ASSERT
   expect(hof1).to.eql(hofGoal1); 
   expect(hof2).to.eql(hofGoal2); 
  })

  it("should correctly calculate plays", async() => {
       
    //PREP
   hof1 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }

   hofGoal1 = {wins: 0, draws: 4, loss: 0, plays: 4, winRate: 0, drawRate: 100, totalPoints: 4, avgPoints: 1, avgPointsSeason: 2 }
   score1 = 1;
   score2 = 1;
    //ACT
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);

   //ASSERT
   expect(hof1).to.eql(hofGoal1); 
  })

  it("should calculate average game points by a user with multiple results", async() => {
       
    //PREP
   hof1 = {wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0 }

   score1 = 2;
   score2 = 0;
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);
   
   score1 = 2;
   score2 = 0;
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);

    //ACT
   score1 = 2;
   score2 = 0;
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);

   score1 = 2;
   score2 = 0;
   hof1 = windraw.calcWinDraw(score1, score2, hof1, 2);
   
   avgPoints = Math.abs(parseInt(hof1.avgPoints));
   //ASSERT
   expect(avgPoints).to.eql(2); 
  })
});