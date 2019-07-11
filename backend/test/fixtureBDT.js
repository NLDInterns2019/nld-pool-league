process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var chaiThings = require("chai-things");
var chaiLike = require("chai-like");
var server = require("../server");
var knex = require("../db/knex");
var should = chai.should();

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

describe("Fixture", () => {
    //PREPARE DB
    beforeEach(function(done) {
      knex.migrate
        .rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run())
        .then(() => done())
        .catch(done);
    });

    
  describe("GET /api/8ball_fixture", () => {
    it("should get all the players in the fixture", done => {
      chai
        .request(server)
        .get("/api/8ball_fixture")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          //res.body.length.should.be.eql(6);
          res.body.should.include.something.like({
            seasonId: 2020,
            score1: null,
            score2: null,
            player1: "Michael",
            player2: "Matthew"
          });
          res.body.should.include.something.like({
            seasonId: 2020,
            score1: null,
            score2: null,
            player1: "Michael",
            player2: "Natalie"
          });
          res.body.should.include.something.like({
            seasonId: 2020,
            score1: null,
            score2: null,
            player1: "Matthew",
            player2: "Natalie"
          });
          done();
        });
    });
});
});  