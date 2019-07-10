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

describe("League", () => {
  //PREPARE DB
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done())
      .catch(done);
  });

  describe("GET /api/8ball_league", () => {
    it("should get all the players in the league", done => {
      chai
        .request(server)
        .get("/api/8ball_league")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(6);
          res.body.should.include.something.like({
            seasonId: 2019,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            seasonId: 2019,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            seasonId: 2019,
            staffName: "Natalie"
          });
          res.body.should.include.something.like({
            seasonId: 2020,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            seasonId: 2020,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            seasonId: 2020,
            staffName: "Natalie"
          });
          done();
        });
    });

    it("should get all the players in the specific season", done => {
      chai
        .request(server)
        .get("/api/8ball_league/2019")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(3);
          res.body[0].should.have.property("seasonId");
          res.body[0].seasonId.should.be.eql(2019);
          res.body[0].should.have.property("staffName");
          res.body[0].staffName.should.be.eql("Matthew");
          res.body[1].should.have.property("seasonId");
          res.body[1].seasonId.should.be.eql(2019);
          res.body[1].should.have.property("staffName");
          res.body[1].staffName.should.be.eql("Michael");
          res.body[2].should.have.property("seasonId");
          res.body[2].seasonId.should.be.eql(2019);
          res.body[2].should.have.property("staffName");
          res.body[2].staffName.should.be.eql("Natalie");
          done();
        });
    });

    it("should not get any player for a nonexistent season", done => {
      chai
        .request(server)
        .get("/api/8ball_league/2077")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("POST /api/8ball_league/add/player", () => {
    it("should post a player to the league", done => {
      chai
        .request(server)
        .post("/api/8ball_league/add/player")
        .send({
          seasonId: 2222,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          chai
            .request(server)
            .get("/api/8ball_league")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.include.something.like({
                seasonId: 2222,
                staffName: "Michael"
              });
              done();
            });
        });
    });
    it("should not post a duplicate player", done => {
      chai
        .request(server)
        .post("/api/8ball_league/add/player")
        .send({
          seasonId: 2019,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("DELETE /api/8ball_league/delete/player", () => {
    it("should delete a player from the league", done => {
      chai
        .request(server)
        .delete("/api/8ball_league/delete/player")
        .send({
          seasonId: 2019,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
          .request(server)
          .get("/api/8ball_league")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.should.not.include.something.like({
              seasonId: 2019,
              staffName: "Michael"
            });
            done();
          });
        });
    });
    it("should not delete a non-existing player from the league", done => {
      chai
        .request(server)
        .delete("/api/8ball_league/delete/player")
        .send({
          seasonId: 2077,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
