process.env.NODE_ENV = "test";

var moment = require("moment");

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

describe("Bookings", () => {
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

  describe("GET /api/booking", () => {
    it("should get all the bookings", done => {
      chai
        .request(server)
        .get("/api/booking")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(3);
          res.body.should.include.something.like({
            player1: "Michael",
            player2: "Matthew",
            title: "Michael VS Matthew"
          });
          res.body.should.include.something.like({
            player1: "Natalie",
            player2: "Matthew",
            title: "Natalie VS Matthew"
          });
          res.body.should.include.something.like({
            player1: "Natalie",
            player2: "Michael",
            title: "Natalie VS Michael"
          });
          done();
        });
    });
  });

  describe("GET /api/booking/upcoming", () => {
    it("should get all upcoming bookings", done => {
      chai
        .request(server)
        .get("/api/booking/upcoming")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(2);
          res.body.should.include.something.like({
            player1: "Natalie",
            player2: "Matthew",
            title: "Natalie VS Matthew"
          });
          res.body.should.include.something.like({
            player1: "Natalie",
            player2: "Michael",
            title: "Natalie VS Michael"
          });
          done();
        });
    });
  });

  describe("POST /api/booking/add", () => {
    let start = moment()
      .toDate()
      .toISOString();
    let end = moment()
      .add(30, "minutes")
      .toDate()
      .toISOString();
    it("should add a booking", done => {
      chai
        .request(server)
        .post("/api/booking/add")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          start: start,
          end: end,
          player1: "Michael",
          player2: "Matthew",
          title: "Michael VS Matthew"
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/booking")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(4);
              res.body.should.include.something.like({
                start: start,
                end: end,
                player1: "Michael",
                player2: "Matthew",
                title: "Michael VS Matthew"
              });
              done();
            });
        });
    });
  });

  describe("PUT /api/booking/add/message_id", () => {
    it("should slack message id to the booking", done => {
      chai
        .request(server)
        .put("/api/booking/add/message_id")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          id: 1,
          messageId: "QWERTY"
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/booking")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(3);
              res.body.should.include.something.like({
                id: 1,
                messageId: "QWERTY",
                player1: "Michael",
                player2: "Matthew",
                title: "Michael VS Matthew"
              });
              done();
            });
        });
    });
  });

  describe("DELETE /api/booking/delete", () => {
    it("should add a booking", done => {
      chai
        .request(server)
        .delete("/api/booking/delete")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          id: 1
        })
        .end((err, res) => {
          res.should.have.status(204);
          chai
            .request(server)
            .get("/api/booking")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(2);
              res.body.should.not.include.something.like({
                id: 1,
                player1: "Michael",
                player2: "Matthew",
                title: "Michael VS Matthew"
              });
              done();
            });
        });
    });
  });
});
