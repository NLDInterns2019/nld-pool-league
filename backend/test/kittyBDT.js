process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var chaiThings = require("chai-things");
var chaiLike = require("chai-like");
var server = require("../server");
var knex = require("../db/knex");

var token = require("./function/token");

chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);

describe("Kitty", () => {
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

  describe("GET /api/kitty", () => {
    it("should get all the kitty details", done => {
      chai
        .request(server)
        .get("/api/kitty")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(3);
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            staffName: "Michael",
            description: "Joining fee",
            value: 2.0,
            total: 2.0
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            staffName: "Matthew",
            description: "Joining fee",
            value: 2.0,
            total: 4.0
          });
          res.body.should.include.something.like({
            type: 8,
            seasonId: 2020,
            staffName: "Natalie",
            description: "Joining fee",
            value: 2.0,
            total: 6.0
          });
          done();
        });
    });
  });

  describe("POST /api/kitty/transaction", () => {
    it("should do credit transaction properly", done => {
      chai
        .request(server)
        .post("/api/kitty/transaction")
        .set("authorization", `Bearer ${bearerToken}`)
        .send({
          type: 8,
          seasonId: 2222,
          staffName: "Michael",
          description: "credit test",
          value: 2.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai
            .request(server)
            .get("/api/kitty")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.should.include.something.like({
              type: 8,
              seasonId: 2222,
              staffName: "Michael",
              description: "credit test",
              value: 2.5,
              total: 8.5
              });
              done();
            });
        });
    });
    it("should do debit transaction properly", done => {
        chai
          .request(server)
          .post("/api/kitty/transaction")
          .set("authorization", `Bearer ${bearerToken}`)
          .send({
            type: 8,
            seasonId: 2222,
            staffName: "Michael",
            description: "debit test",
            value: -8.5
          })
          .end((err, res) => {
            res.should.have.status(200);
            chai
              .request(server)
              .get("/api/kitty")
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.should.include.something.like({
                type: 8,
                seasonId: 2222,
                staffName: "Michael",
                description: "debit test",
                value: -8.5,
                total: -2.5
                });
                done();
              });
          });
      });
  });
});
