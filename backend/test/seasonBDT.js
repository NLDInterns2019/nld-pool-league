process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var knex = require("../db/knex");

var should = chai.should();

chai.use(chaiHttp);

console.log(process.env.DBPASSWORD);

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

  describe("GET /api/8ball_season", () => {
    it("should get all the seasons", done => {
      chai
        .request(server)
        .get("/api/8ball_season")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(2);
          res.body[0].should.have.property("seasonId");
          res.body[0].seasonId.should.be.eql(2019);
          res.body[1].should.have.property("seasonId");
          res.body[1].seasonId.should.be.eql(2020);
          done();
        });
    });
  });

  describe("DELETE /api/8ball_season/delete/", () => {
    it("should delete 2019 season", done => {
      chai
        .request(server)
        .delete("/api/8ball_season/delete/")
        .send({
          seasonId: 2019
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
            .request(server)
            .get("/api/8ball_season")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(1);
              res.body[0].should.have.property("seasonId");
              res.body[0].seasonId.should.be.eql(2020);
              done();
            });
        });
    });
    it("should not delete non-existent season", done => {
        chai
        .request(server)
        .delete("/api/8ball_season/delete/")
        .send({
          seasonId: 2077
        })
        .end((err, res) => {
            res.should.have.status(404);
            done();
        })
    })
  });
});
