process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var chaiThings = require("chai-things");
var chaiLike = require("chai-like");
var server = require("../server");
var knex = require("../db/knex");

var token = require("./function/token");

var should = chai.should();

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

describe("League", () => {
  let bearerToken;
  //Get token
  before(function(done) {
    token().then(result => {
      bearerToken = result;
      done();
    });
  });

  //PREPARE DB
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done())
      .catch(done);
  });

  describe("GET /api/89ball_league", () => {
    it("should get all the players in the 8 ball league", done => {
      chai
        .request(server)
        .get("/api/89ball_league?type=8")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(6);
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Natalie"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            staffName: "Natalie"
          });
          done();
        });
    });
    it("should get all the players in the 9 ball league", done => {
      chai
        .request(server)
        .get("/api/89ball_league?type=9")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(6);
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2019,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2019,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2019,
            staffName: "Natalie"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2020,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2020,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2020,
            staffName: "Natalie"
          });
          done();
        });
    });

    it("should get all the players in the specific season in the 8 league", done => {
      chai
        .request(server)
        .get("/api/89ball_league/2019?type=8")
        .send({ type: 8 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(3);
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Natalie"
          });
          done();
        });
    });

    it("should get all the players in the specific season in the 9 league", done => {
      chai
        .request(server)
        .get("/api/89ball_league/2019?type=9")
        .send({ type: 9 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(3);
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2019,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2019,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 9,
            seasonId: 2019,
            staffName: "Natalie"
          });
          done();
        });
    });

    it("should not get any player for a nonexistent season", done => {
      chai
        .request(server)
        .get("/api/89ball_league/2077?type=8")
        .send({ type: 8 })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("POST /api/89ball_league/add/player", () => {
    it("should post a player to the 8 league", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2222,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/89ball_league?type=8")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.include.something.like({
                type: 8,
                seasonId: 2222,
                staffName: "Michael"
              });
              done();
            });
        });
    });
    it("should post a player to the 9 league", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 9,
          seasonId: 2222,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/89ball_league?type=9")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.include.something.like({
                type: 9,
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
        .post("/api/89ball_league/add/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2019,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("POST /api/89ball_league/add/players", () => {
    it("should bulk post players to the 8 ball league", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/players")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2222,
          staffs: [
            { type: 8, seasonId: 2222, staffName: "Michael" },
            { type: 8, seasonId: 2222, staffName: "Matthew" }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/89ball_league?type=8")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.include.something.like({
                type: 8,
                seasonId: 2222,
                staffName: "Michael"
              });
              res.body.should.include.something.like({
                type: 8,
                seasonId: 2222,
                staffName: "Matthew"
              });
              done();
            });
        });
    });
    it("should bulk post players to the 9 ball league", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/players")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 9,
          seasonId: 2222,
          staffs: [
            { type: 9, seasonId: 2222, staffName: "Michael" },
            { type: 9, seasonId: 2222, staffName: "Matthew" }
          ]
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/89ball_league?type=9")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.include.something.like({
                type: 9,
                seasonId: 2222,
                staffName: "Michael"
              });
              res.body.should.include.something.like({
                type: 9,
                seasonId: 2222,
                staffName: "Matthew"
              });
              done();
            });
        });
    });
    it("should not bulk post players on an existing season", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/players")
        .set("authorization", `Bearer ${bearerToken}`)
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

  describe("DELETE /api/89ball_league/delete/player", () => {
    it("should delete a player from the 8 ball league", done => {
      chai
        .request(server)
        .delete("/api/89ball_league/delete/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2019,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
            .request(server)
            .get("/api/89ball_league?type=8")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.not.include.something.like({
                type: 8,
                seasonId: 2019,
                staffName: "Michael"
              });
              done();
            });
        });
    });
    it("should delete a player from the 9 ball league", done => {
      chai
        .request(server)
        .delete("/api/89ball_league/delete/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 9,
          seasonId: 2019,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
            .request(server)
            .get("/api/89ball_league?type=9")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.not.include.something.like({
                type: 9,
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
        .delete("/api/89ball_league/delete/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2077,
          staffName: "Michael"
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("PUT /api/89ball_league/recalculate", () => {
    it("should recalculate correctly, score should not change", done => {
      chai
        .request(server)
        .put("/api/89ball_league/recalculate")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2019
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(3);
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Michael"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Matthew"
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2019,
            staffName: "Natalie"
          });
          done();
        });
    });
  });
});
