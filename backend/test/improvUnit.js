const expect = require("chai").expect;
process.env.NODE_ENV = "test";
const improv = require("../functions/improvement");
const knex = require("../db/knex");

describe("improvement()", () => {
    beforeEach(function(done) {
        knex.migrate
          .rollback()
          .then(() => knex.migrate.latest())
          .then(() => knex.seed.run())
          .then(() => done())
          .catch(done);
    });
    it("should properly calculate a positive improvement rate", () => {

        //PREP
        hof1 = ({ staffName: "Mark", wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0, improvement: 0 },
                { staffName: "Alan", wins: 0, draws: 0, loss: 0, plays: 0, winRate: 0, drawRate: 0, totalPoints: 0, avgPoints: 0, avgPointsSeason: 0, improvement: 0 })

        //old winrate of 50%
        currentLeague = { staffName: "Alan", type: 8, play: 10, win: 5}
        //new winrate of 90%
        pastLeagues = ({staffName: "Alan", type: 8, play: 10, win: 9})
        // = 40% improvement increase

        //ACT
        hof1 = improv.improvementCalc(currentLeague, pastLeagues, hof1, 1)
        console.log(hof1 + "DDDDDDDDDDDDDDDDDDDDDDDDDDDD")
console.log(hof1.improvement )
        //ASSERT
        expect(hof1.improvement).to.eql(40); 
    })
});

//takes in:
//currentLeague with most recent league score
//pastLeagues with old leagues
//hofAll with all hall of fame values