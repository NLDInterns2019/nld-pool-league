const expect = require("chai").expect;
const score = require("../functions/playoffscore");
const moment = require("moment");

describe("calculateScore()", () => {
  const dueDate = moment().add(7, "d");

  beforeEach(() => {
    player1 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      punctuality: 0,
      form: "-----"
    };

    player2 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      punctuality: 0,
      form: "-----"
    };
  });

  it("should calculate the correct winning condition", () => {
    //1. PREP
    score1 = 2;
    score2 = 0;

    let expectedPlayer1 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 2,
      goalsAgainst: 0,
      points: 0,
      punctuality: 0,
      form: "W----"
    };

    let expectedPlayer2 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 0,
      goalsAgainst: 2,
      points: 0,
      punctuality: 0,
      form: "L----"
    };

    //2. ACT
    let players = score.calculateScore(
      player1,
      player2,
      score1,
      score2,
      dueDate
    );

    //3. ASSERT
    expect(players.player1).to.eql(expectedPlayer1);
    expect(players.player2).to.eql(expectedPlayer2);
  });
  it("should calculate the correct losing condition", () => {
    //1. PREP
    score1 = 0;
    score2 = 2;

    expectedPlayer1 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 0,
      goalsAgainst: 2,
      points: 0,
      punctuality: 0,
      form: "L----"
    };

    expectedPlayer2 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 2,
      goalsAgainst: 0,
      points: 0,
      punctuality: 0,
      form: "W----"
    };

    //2. ACT
    let players = score.calculateScore(
      player1,
      player2,
      score1,
      score2,
      dueDate
    );

    //3. ASSERT
    expect(players.player1).to.eql(expectedPlayer1);
    expect(players.player2).to.eql(expectedPlayer2);
  });
  it("should calculate the correct draw condition", () => {
    //1. PREP
    score1 = 1;
    score2 = 1;

    expectedPlayer1 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 1,
      goalsAgainst: 1,
      points: 0,
      punctuality: 0,
      form: "D----"
    };

    expectedPlayer2 = {
      play: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goalsFor: 1,
      goalsAgainst: 1,
      points: 0,
      punctuality: 0,
      form: "D----"
    };

    //2. ACT
    let players = score.calculateScore(
      player1,
      player2,
      score1,
      score2,
      dueDate
    );

    //3. ASSERT
    expect(players.player1).to.eql(expectedPlayer1);
    expect(players.player2).to.eql(expectedPlayer2);
  });
});
