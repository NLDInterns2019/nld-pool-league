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

describe("Seasons", () => {
  //PREPARE DB
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done())
      .catch(done);
  });

  describe("GET /api/89ball_season", () => {
    it("should get all 8ball the seasons", done => {
      chai
        .request(server)
        .get("/api/89ball_season?type=8")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(2);
          res.body.should.include.something.like({
            seasonId: 2019
          });
          res.body.should.include.something.like({
            seasonId: 2020
          });
          done();
        });
    });

    it("should get all 9ball the seasons", done => {
      chai
        .request(server)
        .get("/api/89ball_season?type=9")
        .send({
          type: 9
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(2);
          res.body.should.include.something.like({
            seasonId: 2019
          });
          res.body.should.include.something.like({
            seasonId: 2020
          });
          done();
        });
    });
  });

  describe("DELETE /api/8ball_season/delete/", () => {
    it("should delete 8 ball 2019 season", done => {
      chai
        .request(server)
        .delete("/api/89ball_season/delete/")
        .send({
          type: 8,
          seasonId: 2019
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
            .request(server)
            .get("/api/89ball_season?type=8")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.not.include.something.like({
                type: 8,
                seasonId: 2019
              });
              done();
            });
        });
    });
    it("should delete 9 ball 2019 season", done => {
      chai
        .request(server)
        .delete("/api/89ball_season/delete/")
        .send({
          type: 9,
          seasonId: 2019
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
            .request(server)
            .get("/api/89ball_season?type=9")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.not.include.something.like({
                type: 9,
                seasonId: 2019
              });
              done();
            });
        });
    });
    it("should not delete non-existent season", done => {
      chai
        .request(server)
        .delete("/api/89ball_season/delete/")
        .send({
          type: 8,
          seasonId: 2077
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
