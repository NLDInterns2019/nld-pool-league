import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SubmitScoreForm from "../SubmitScoreForm.js";
import sinon from "sinon";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapper = shallow(<SubmitScoreForm unplayedFixtures={[""]} />);
const score1 = wrapper.find("#score1");
const score2 = wrapper.find("#score2");
const selectFixture = wrapper.find("#selectFixture");
const submitScoreBtn = wrapper.find("#submitScoreBtn");

/* ================================================================================================== */

describe("Rendering", () => {
  it("should render all the elements", () => {
    wrapper.exists().should.be.true;
    score1.exists().should.be.true;
    score2.exists().should.be.true;
    selectFixture.exists().should.be.true;
    submitScoreBtn.exists().should.be.true;
  });
});

/* ================================================================================================== */

describe("Type value into boxes", () => {
  it("should run the relevant functions", () => {
    var score1Spy = sinon.spy(SubmitScoreForm.prototype, "setScore1");
    var score2Spy = sinon.spy(SubmitScoreForm.prototype, "setScore2");

    const eventScore1 = { target: { value: "2" } };
    const eventScore2 = { target: { value: "0" } };

    score1.simulate("change", eventScore1);
    score1Spy.calledOnce.should.be.true;

    score2.simulate("change", eventScore2);
    score2Spy.calledOnce.should.be.true;
  });

  /* ================================================================================================== */

  describe("Type value into score boxes", () => {
    it("should update the state", () => {
      const eventScore1 = { target: { value: "2" } };
      const eventScore2 = { target: { value: "0" } };

      score1.simulate("change", eventScore1);
      score2.simulate("change", eventScore2);

      wrapper.state().score1.should.equal("2");
      wrapper.state().score2.should.equal("0");
    });
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

describe("Clicking Submit", () => {
  it("should run handleSubmit()", () => {
    const wrapper = shallow(<SubmitScoreForm unplayedFixtures={[""]} />);
    const submitScoreBtn = wrapper.find("#submitScoreBtn");
    var spy = sinon.spy(SubmitScoreForm.prototype, "handleSubmit");
    window.alert = () => {};
    var confirm = sinon.stub(global, "confirm");
    confirm.returns(true);

    submitScoreBtn.simulate("click");

    confirm.calledOnce.should.be.true;
    spy.calledOnce.should.be.true;

    confirm.restore();
  });
});

describe("Clicking submit with valid input", () => {
  it("should run postScoreUpdateSlackMessage()", () => {
    var spy = sinon.spy(
      SubmitScoreForm.prototype,
      "postScoreUpdateSlackMessage"
    );
    const wrapper = shallow(
      <SubmitScoreForm unplayedFixtures={[""]} changeFixtureScore={() => {}} />
    );
    const submitScoreBtn = wrapper.find("#submitScoreBtn");

    wrapper.setState({
      players: "PAUL DAVE",
      score1: "2",
      score2: "0"
    });

    window.alert = () => {};
    var confirm = sinon.stub(global, "confirm");
    confirm.returns(true);

    submitScoreBtn.simulate("click");

    confirm.calledOnce.should.be.true;
    spy.calledOnce.should.be.true;

    confirm.restore();
  });
});
