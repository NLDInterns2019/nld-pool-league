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

//   describe("POST /api/89ball_league/hall_of_fame/calculate_v2", () => {
//     it("should calculate the hof correctly", done => {
//       chai
//         .request(server)
//         .put("/api/89ball_fixture/edit/")
//         .set("authorization", `Bearer ${bearerToken}`)
//         .send({
//           type: 8,
//           seasonId: 2020,
//           player1: "Michael",
//           player2: "Matthew",
//           score1: 2,
//           score2: 0
//         })
//         .end((err, res) => {
//           res.should.have.status(200);
//           chai
//             .request(server)
//             .post("/api/89ball_league/hall_of_fame/calculate_v2")
//             .set("authorization", `Bearer ${bearerToken}`)
//             .send({
//               type: 8,
//               seasonId: 2020,
//               player1: "Michael",
//               player2: "Matthew",
//               score1: 2,
//               score2: 0
//             })
//             .end((err, res) => {

//             })
//         });
//     });
  });
});
