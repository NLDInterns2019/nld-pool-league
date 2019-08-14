import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SubmitScoreForm from "../fixture/SubmitScoreForm";

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
    expect(wrapper.exists()).to.be.true;
    expect(selectFixture.exists()).to.be.true;
    expect(submitScoreBtn.exists()).to.be.true;
    expect(player1RadioBtn.exists()).to.be.true;
    expect(player2RadioBtn.exists()).to.be.true;
    expect(drawRadioBtn.exists()).to.be.true;
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
    expect(wrapper.instance().isValid()).to.be.false;
  });

  it("should return false if 1 field is empty", () => {
    wrapper.setState({
      score1: "1",
      score2: ""
    });

    expect(wrapper.instance().isValid()).to.be.false;
  });

  it("should return false if the score fields are empty", () => {
    wrapper.setState({
      score1: "",
      score2: ""
    });

    expect(wrapper.instance().isValid()).to.be.false;
  });

  it("should return false if numbers don't add up to 2", () => {
    wrapper.setState({
      score1: "1",
      score2: "0"
    });

    expect(wrapper.instance().isValid()).to.be.false;

    wrapper.setState({
      score1: "3",
      score2: "3"
    });

    expect(wrapper.instance().isValid()).to.be.false;
  });

  it("should return true if all fields are filled in correctly", () => {
    wrapper.setState({
      score1: "1",
      score2: "1"
    });

    expect(wrapper.instance().isValid()).to.be.true;
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
    wrapper.instance().player1won = {
      current: { checked: true }
    };

    wrapper.instance().player2won = {
      current: { checked: false }
    };

    wrapper.instance().draw = {
      current: { checked: false }
    };

    wrapper.instance().handleRadioClick();

    expect(wrapper.state().score1).to.equal(2);
    expect(wrapper.state().score2).to.equal(0);
  });

  it("should set the score correctly when player 2 wins", () => {
    wrapper.instance().player1won = {
      current: { checked: false }
    };

    wrapper.instance().player2won = {
      current: { checked: true }
    };

    wrapper.instance().draw = {
      current: { checked: false }
    };

    wrapper.instance().handleRadioClick();

    expect(wrapper.state().score1).to.equal(0);
    expect(wrapper.state().score2).to.equal(2);
  });

  it("should set the score correctly when it's a draw", () => {
    wrapper.instance().player1won = {
      current: { checked: false }
    };

    wrapper.instance().player2won = {
      current: { checked: false }
    };

    wrapper.instance().draw = {
      current: { checked: true }
    };

    wrapper.instance().handleRadioClick();

    expect(wrapper.state().score1).to.equal(1);
    expect(wrapper.state().score2).to.equal(1);
  });
});

describe("Clearing radio buttons", () => {
  it("should clear radio buttons when clearRadioButtons() is called", () => {
    wrapper.instance().player1won = {
      current: { checked: false }
    };

    wrapper.instance().player2won = {
      current: { checked: false }
    };

    wrapper.instance().draw = {
      current: { checked: true }
    };

    wrapper.instance().clearRadioButtons();

    expect(wrapper.instance().player1won.current.checked).to.be.false;
    expect(wrapper.instance().draw.current.checked).to.be.false;
    expect(wrapper.instance().player2won.current.checked).to.be.false;
  });
});

describe("Radio buttons", () => {
  it("should appear when a fixture is selected", () => {
    wrapper.setState({
      players: "matthew michael"
    });

    expect(wrapper.instance().resultStyle().display).to.equal("block");
  });

  it("should disappear when a fixture isn't selected", () => {
    wrapper.setState({
      players: ""
    });

    expect(wrapper.instance().resultStyle().display).to.equal("none");
  });
});

describe("setting scores", () => {
  beforeEach(() => {
    wrapper.setState({
      score1: "",
      score2: ""
    });
  });

  describe("setScore1()", () => {
    it("should change the state so that score1 is correct", () => {
      wrapper.instance().setScore1(2);

      expect(wrapper.state().score1).to.equal(2);
      expect(wrapper.state().score2).to.equal("");
    });
  });
  describe("setScore2()", () => {
    it("should change the state so that score2 is correct", () => {
      wrapper.instance().setScore2(2);

      expect(wrapper.state().score1).to.equal("");
      expect(wrapper.state().score2).to.equal(2);
    });
  });
});
