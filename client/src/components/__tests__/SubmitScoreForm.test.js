import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SubmitScoreForm from "../fixture/SubmitScoreForm";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapper = shallow(<SubmitScoreForm unplayedFixtures={[""]} />);
const selectFixture = wrapper.find("#selectFixture");
const submitScoreBtn = wrapper.find("#submitScoreBtn");
const player1RadioBtn = wrapper.find("#player1won");
const player2RadioBtn = wrapper.find("#player2won");
const drawRadioBtn = wrapper.find("#draw");

/* ================================================================================================== */

describe("Rendering", () => {
  it("should render all the elements", () => {
    wrapper.exists().should.be.true;
    selectFixture.exists().should.be.true;
    submitScoreBtn.exists().should.be.true;
    player1RadioBtn.exists().should.be.true;
    player2RadioBtn.exists().should.be.true;
    drawRadioBtn.exists().should.be.true;
  });
});

/* ================================================================================================== */

describe("Validation", () => {
  beforeEach(() => {
    wrapper.setState({
      score1: "",
      score2: ""
    });
  });

  it("should return false if all fields are empty", () => {
    wrapper.instance().isValid().should.be.false;
  });

  it("should return false if 1 field is empty", () => {
    wrapper.setState({
      score1: "1",
      score2: ""
    });

    wrapper.instance().isValid().should.be.false;
  });

  it("should return false if the score fields are empty", () => {
    wrapper.setState({
      score1: "",
      score2: ""
    });

    wrapper.instance().isValid().should.be.false;
  });

  it("should return false if numbers don't add up to 2", () => {
    wrapper.setState({
      score1: "1",
      score2: "0"
    });

    wrapper.instance().isValid().should.be.false;

    wrapper.setState({
      score1: "3",
      score2: "3"
    });

    wrapper.instance().isValid().should.be.false;
  });

  it("should return true if all fields are filled in correctly", () => {
    wrapper.setState({
      score1: "1",
      score2: "1"
    });

    wrapper.instance().isValid().should.be.true;
  });
});

describe("Clicking a radio button", () => {
  beforeEach(() => {
    wrapper.setState({
      score1: "",
      score2: ""
    });
  });

  it("should set the score correctly when player 1 wins", () => {
    wrapper.instance().refs = {
      player1won: { checked: true },
      draw: { checked: false },
      player2won: { checked: false }
    };

    wrapper.instance().handleRadioClick();

    wrapper.state().score1.should.equal(2);
    wrapper.state().score2.should.equal(0);
  });

  it("should set the score correctly when player 2 wins", () => {
    wrapper.instance().refs = {
      player1won: { checked: false },
      draw: { checked: false },
      player2won: { checked: true }
    };

    wrapper.instance().handleRadioClick();

    wrapper.state().score1.should.equal(0);
    wrapper.state().score2.should.equal(2);
  });

  it("should set the score correctly when it's a draw", () => {
    wrapper.instance().refs = {
      player1won: { checked: false },
      draw: { checked: true },
      player2won: { checked: false }
    };

    wrapper.instance().handleRadioClick();

    wrapper.state().score1.should.equal(1);
    wrapper.state().score2.should.equal(1);
  });
});

describe("Clearing radio buttons", () => {
  it("should clear radio buttons when clearRadioButtons() is called", () => {
    wrapper.instance().refs = {
      player1won: { checked: false },
      draw: { checked: true },
      player2won: { checked: false }
    };

    wrapper.instance().clearRadioButtons();

    wrapper.instance().refs.player1won.checked.should.be.false;
    wrapper.instance().refs.draw.checked.should.be.false;
    wrapper.instance().refs.player2won.checked.should.be.false;
  });
});
