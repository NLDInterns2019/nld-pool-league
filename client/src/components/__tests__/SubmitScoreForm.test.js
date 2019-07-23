import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SubmitScoreForm from "../fixture/SubmitScoreForm";
import sinon from "sinon";
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

/*describe("Clicking a radio button", () => {
  it("should set the score correctly", () => {
    wrapper.instance().refs = {
      player1won: { checked: false },
      draw: { checked: false },
      player2won: { checked: false }
    };

    player1RadioBtn.simulate("click");

    wrapper.state().score1.should.equal(2);
    wrapper.state().score2.should.equal(0);
  });
});*/

//TODO FIX THIS TEST

// describe("Clicking Submit", () => {
//   it("should run handleSubmit()", () => {
//     const wrapper = shallow(<SubmitScoreForm unplayedFixtures={[""]} />);
//     const submitScoreBtn = wrapper.find("#submitScoreBtn");
//     var spy = sinon.spy(SubmitScoreForm.prototype, "handleSubmit");
//     window.alert = () => {};
//     var confirm = sinon.stub(global, "confirm");
//     confirm.returns(true);

//     submitScoreBtn.simulate("click");

//     confirm.calledOnce.should.be.true;
//     spy.calledOnce.should.be.true;

//     confirm.restore();
//   });
// });
