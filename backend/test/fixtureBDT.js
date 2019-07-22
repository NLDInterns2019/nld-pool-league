process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var chaiThings = require("chai-things");
var chaiLike = require("chai-like");
var server = require("../server");
var knex = require("../db/knex");
var should = chai.should();

var token = require("./function/token");

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

describe("Fixture", () => {
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

    
  describe("GET /api/89ball_fixture/:seasonId", () => {
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
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  
  });

  describe("GET /api/89ball_fixture/:seasonId/?staffName", () => {
    it("should fetch the correct staffmember's fixture from the correct season", done => {
        chai
          .request(server)
          .get("/api/89ball_fixture/2020/?type=8&staffName=Michael")
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

    it("should return empty array for a nonexistant user", done => {
        chai
          .request(server)
          .get("/api/89ball_fixture/2020/?type=8&staffName=Winston")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(0);
            done();
          });
      });
  });


//need to set up fixturegen with some data where it can generate current date
  describe("POST /api/89ball_fixture/generate", () => {
    it("should add players in prep", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2424,
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
                seasonId: 2424,
                staffName: "Michael"
              });
              done();
            });
        });
    });
    it("should post a player to the 8 league", done => {
      chai
        .request(server)
        .post("/api/89ball_league/add/player")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2424,
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
                seasonId: 2424,
                staffName: "Michael"
              });
              done();
            });
        });
    });

    it("should set the first date to today's date and iterate them suitably", done => {
      chai
        .request(server)
        .get("/api/89ball_fixture/generate/2019?type=8")
        .end((err, res) => {
        });
        done();
    });
  });

 

  // //need to set up fixturegen with some data where it can generate current date
  // describe("POST /api/89ball_fixture/generate", () => {
  //   it("should set the first date to today's date and iterate them suitably", done => {
  //       chai
  //         .request(server)
  //         .post("/api/89ball_fixture/generate")
  //         .set("authorization", `Bearer ${bearerToken}`)
  //         .send({
  //           seasonId: 2020,
  //           type: 8
  //         })
  //         .end((err, res) => {
  //           console.log(res.body.type + " MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
  //           res.body.should.include.something.like({
  //             type: 8,
  //             seasonId: 2020,
  //            // date: new Date().getDate()
  //           })
  //         });
  //         done();
  //   });

  //   it("should set the first group as 0 and iterate them suitably", done => {
  //     chai
  //       .request(server)
  //       .get("/api/89ball_fixture/generate/2019?type=8")
  //       .end((err, res) => {
  //       });
  //       done();
  // });

  // it("should fetch the correct staffmember's fixture from the correct season", done => {
  //   chai
  //     .request(server)
  //     .get("/api/89ball_fixture/2020/Michael?type=8")
  //     .end((err, res) => {
  //     });
  //     done();
  //   });

  //   it("should ", done => {
  //     chai
  //       .request(server)
  //       .get("/api/89ball_fixture/2020/Matthew?type=8")
  //       .end((err, res) => {
  //       });
  //       done();
  // });
  // }); 
});