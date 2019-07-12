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

    
  describe("GET /api/89ball_fixture", () => {
    it("should get all the fixture in the 8 ball league", done => {
      chai
        .request(server)
        .get("/api/89ball_fixture?type=8")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            score1: null,
            score2: null,
            player1: "Michael",
            player2: "Matthew"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            score1: null,
            score2: null,
            player1: "Michael",
            player2: "Natalie"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            score1: null,
            score2: null,
            player1: "Matthew",
            player2: "Natalie"
          });
          done();
        });
    });
  
  it("should get all the players in the specific fixtures", done => {
    chai
      .request(server)
      .get("/api/89ball_fixture/2020?type=8")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(3);
        res.body.should.include.something.like({
          type: 8,
          seasonId: 2020,
          score1: null,
          score2: null,
          player1: "Michael",
          player2: "Matthew"
        });
        res.body.should.include.something.like({
          type: 8,
          seasonId: 2020,
          score1: null,
          score2: null,
          player1: "Michael",
          player2: "Natalie"
        });
        res.body.should.include.something.like({
          type: 8,
          seasonId: 2020,
          score1: null,
          score2: null,
          player1: "Matthew",
          player2: "Natalie"
        });
        done();
      });
  });

  it("should not get any player for a nonexistent fixture", done => {
    chai
      .request(server)
      .get("/api/89ball_fixture/2077?type=8")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  });
  describe("GET /api/89ball_fixture/:seasonId/:staffName", () => {
    it("should fetch the correct staffmember's fixture from the correct season", done => {
        chai
          .request(server)
          .get("/api/89ball_fixture/2020/Michael?type=8")
          .end((err, res) => {
            res.body.should.include.something.like({
              type: 8,
              seasonId: 2020,
              score1: null,
              score2: null,
              player1: "Michael",
              player2: "Matthew"
            });
            res.body.should.include.something.like({
              type: 8,
              seasonId: 2020,
              score1: null,
              score2: null,
              player1: "Michael",
              player2: "Natalie"
            });
          });
          done();
    });

    it("should return 404 for a nonexistant user", done => {
        chai
          .request(server)
          .get("/api/89ball_fixture/2020/Alan?type=8")
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
  });

    // describe("GET /api/89ball_fixture/unplayed/:seasonId", () => {
    //     it("should get fixtures that have not been played", done => {
    //       chai
    //         .request(server)
    //         .get("/api/89ball_fixture/due/2019")
    //         .end((err, res) => {
    //             res.should.be.a("Object");
    //             console.log(res.body + " MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMDDDDDDDDDDDDDDDDDD")
    //             res.body[0].should.have.property("score1")
    //             res.body[0].score1.should.be.eql(null)
    //             res.body[0].should.have.property("score2")
    //             res.body[0].score2.should.be.eql(null)
    //             done();
    //         });
    //     });
    // });
});  