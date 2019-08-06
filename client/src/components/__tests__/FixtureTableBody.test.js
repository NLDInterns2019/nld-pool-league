import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const today = new Date();
const overdueFixture = { date: "Jul 03 2019", score1: null, score2: null };
const normalFixture = { date: "Aug 03 3000", score1: null, score2: null };
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
    expect(isOverdue(new Date(normalFixture.date))).to.be.false;
  });

  it("should return true when fixture date is before today", () => {
    expect(isOverdue(new Date(overdueFixture.date))).to.be.true;
  });
});

describe("isNotFinished()", () => {
  it("should return false if a score has been submitted", () => {
    expect(isNotFinished(playedFixture.score1)).to.be.false;
  });
  it("should return true if a score hasn't been submitted", () => {
    expect(isNotFinished(overdueFixture.score1)).to.be.true;
  });
});
