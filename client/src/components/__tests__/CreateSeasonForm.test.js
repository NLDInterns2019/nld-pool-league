import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CreateSeasonForm from "../CreateSeasonForm.js";
import sinon from "sinon";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

/* initalise the different elements to avoid repetition */
const wrapper = shallow(<CreateSeasonForm />);
const addPlayerBtn = wrapper.find("#addPlayer");
const createSeasonBtn = wrapper.find("#createSeasonBtn");
const inputSeasonNo = wrapper.find("#inputSeasonNo");

describe("Rendering", () => {
  it("should render the different elements", () => {
    wrapper.exists().should.be.true;
    addPlayerBtn.exists().should.be.true;
    createSeasonBtn.exists().should.be.true;
    inputSeasonNo.exists().should.be.true;
  });
});

describe("Add a Player", () => {
  it("should add a player to the state", () => {
    // run the add player method, players length should increase by 1
    wrapper.setState({ players: [] });
    wrapper.instance().addPlayer();
    wrapper.state().players.should.have.lengthOf(1);
  });
});

describe("Add Player button click", () => {
  it("should run addPlayer() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "addPlayer");

    addPlayerBtn.simulate("click");
    spy.calledOnce.should.be.true;
  });
});

describe("Remove a Player", () => {
  it("should remove a player from the state", () => {
    const initialArr = ["ALICE", "BOB", "CHARLES"];
    const expectedArr = ["ALICE", "CHARLES"];

    wrapper.setState({ players: initialArr });
    wrapper.state().players.should.have.lengthOf(3);

    wrapper.instance().removePlayer(1);

    wrapper.state().players.should.have.lengthOf(2);
    wrapper.state().players[0].should.equal(expectedArr[0]);
    wrapper.state().players[1].should.equal(expectedArr[1]);
  });
});

describe("Remove Player button click", () => {
  it("should run removePlayer() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "removePlayer");

    /* add 2 players so remove buttons are visible */
    addPlayerBtn.simulate("click");
    addPlayerBtn.simulate("click");

    const removePlayerBtn = wrapper.find("#button2");

    removePlayerBtn.simulate("click");
    spy.calledOnce.should.be.true;
  });
});

describe("Create Season button click", () => {
  it("should run createSeason() function", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "createSeason");
    const wrapper = shallow(<CreateSeasonForm />);
    const createSeasonBtn = wrapper.find("#createSeasonBtn");

    // prevents error with alerts. An alert showing is normal behaviour, not an error
    window.alert = () => {};

    createSeasonBtn.simulate("click");

    spy.calledOnce.should.be.true;
  });
});

describe("Typing a season number", () => {
  it("should run setSeasonName()", () => {
    var spy = sinon.spy(CreateSeasonForm.prototype, "setSeasonName");
    const event = { target: { value: "1" } };
    inputSeasonNo.simulate("change", event);

    spy.called.should.be.true;
  });

  it("should change the state", () => {
    const event = { target: { value: "1" } };
    inputSeasonNo.simulate("change", event);
    wrapper.state().seasonName.should.equal("1");
  });
});
