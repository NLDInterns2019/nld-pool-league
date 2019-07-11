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
  
  it("should get all the players in the specific fixtures", done => {
    chai
      .request(server)
      .get("/api/8ball_fixture/2020")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(3);
       /* res.body[0].should.have.property("seasonId");
        res.body[0].seasonId.should.be.eql(2020);
        res.body[0].should.have.property("player1");
        res.body[0].staffName.should.be.eql("Michael");
        res.body[0].should.have.property("player2");
        res.body[0].staffName.should.be.eql("Matthew");*/
        done();
      });
  });

  it("should not get any player for a nonexistent fixture", done => {
    chai
      .request(server)
      .get("/api/8ball_fixture/2077")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  });
  describe("GET /api/8ball_fixture/:seasonId/:staffName", () => {
    it("should fetch the correct staffmember's fixture from the correct season", done => {
        chai
          .request(server)
          .get("/api/8ball_fixture/2020/Michael")
          .end((err, res) => {
              res.should.be.a("Object");
              res.body[0].should.have.property("player1")
              res.body[0].player1.should.be.eql("Michael")
              res.body[0].should.have.property("seasonId")
              res.body[0].seasonId.should.be.eql(2020)
          });
          done();
    });

    it("should return 404 for a nonexistant user", done => {
        chai
          .request(server)
          .get("/api/8ball_fixture/2020/Alan")
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
  });
});  