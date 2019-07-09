process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var knex = require("../db/knex");

var should = chai.should();

chai.use(chaiHttp);

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
          res.body[0].should.have.property("seasonId");
          res.body[0].seasonId.should.be.eql(2019);
          res.body[0].should.have.property("staffName");
          res.body[0].staffName.should.be.eql("Matthew");
          res.body[0].should.have.property("play");
          res.body[0].play.should.be.eql(0);
          res.body[0].should.have.property("win");
          res.body[0].win.should.be.eql(0);
          res.body[0].should.have.property("draw");
          res.body[0].draw.should.be.eql(0);
          res.body[0].should.have.property("lose");
          res.body[0].lose.should.be.eql(0);
          res.body[0].should.have.property("goalsFor");
          res.body[0].goalsFor.should.be.eql(0);
          res.body[0].should.have.property("goalsAgainst");
          res.body[0].goalsAgainst.should.be.eql(0);
          res.body[0].should.have.property("points");
          res.body[0].points.should.be.eql(0);
          done();
        });
    });
  });
});
