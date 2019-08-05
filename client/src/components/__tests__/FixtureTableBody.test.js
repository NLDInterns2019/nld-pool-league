import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import FixtureTableBody from "../fixture/FixtureTableBody.js";
import sinon from "sinon";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const today = new Date();
const overdueFixture = { date: "Jul 03 2019", score1: null, score2: null };
const normalFixture = { date: "Aug 03 2025", score1: null, score2: null };
const playedFixture = { date: "Jul 03 2019", score1: "2", score2: "0" };

/* copied from FixtureTableBody.js */
const isOverdue = fixtureDate => {
  return fixtureDate < today;
};

/* copied from FixtureTableBody.js */
const isNotFinished = score => {
  return score === null;
};

describe("isOverdue()", () => {
  it("should return false when fixture date is after today", () => {
    isOverdue(new Date(normalFixture.date)).should.be.false;
  });

  it("should return true when fixture date is before today", () => {
    isOverdue(new Date(overdueFixture.date)).should.be.true;
  });
});

describe("isNotFinished()", () => {
  it("should return false if a score has been submitted", () => {
    isNotFinished(playedFixture.score1).should.be.false;
  });
  it("should return true if a score hasn't been submitted", () => {
    isNotFinished(overdueFixture.score1).should.be.true;
  });
});
