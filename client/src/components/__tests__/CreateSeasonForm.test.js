import React from "react";
import chai, { expect, should } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount, render, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CreateSeasonForm from "../CreateSeasonForm.js";
import sinon from "sinon";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("Rendering", () => {
  it("should render the different elements", () => {
    const wrapper = shallow(<CreateSeasonForm />);
    const addPlayerBtn = wrapper.find("#addPlayer");
    const createSeasonBtn = wrapper.find("#createSeasonBtn");
    const inputSeasonNo = wrapper.find("#inputSeasonNo");

    wrapper.exists().should.be.true;
    addPlayerBtn.exists().should.be.true;
    createSeasonBtn.exists().should.be.true;
    inputSeasonNo.exists().should.be.true;
  });
});

describe("Add a Player", () => {
  it("should add a player to the state", () => {
    const wrapper = shallow(<CreateSeasonForm />);

    // run the add player method, players length should increase by 1
    wrapper.setState({ players: [] });
    wrapper.instance().addPlayer();
    wrapper.state().players.should.have.lengthOf(1);
  });
});

describe("Add Player button click", () => {
  it("should run addPlayer() function", () => {
    const wrapper = shallow(<CreateSeasonForm />);
    const addPlayerBtn = wrapper.find("#addPlayer");
    var spy = sinon.spy(CreateSeasonForm.prototype, "addPlayer");

    addPlayerBtn.simulate("click");
    spy.calledOnce.should.be.true;
  });
});

describe("Remove a Player", () => {
  it("should remove a player from the state", () => {
    const wrapper = shallow(<CreateSeasonForm />);
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
    const wrapper = shallow(<CreateSeasonForm />);
    wrapper.find("#addPlayer").simulate("click");
    wrapper.find("#addPlayer").simulate("click");
    const removePlayerBtn = wrapper.find("#button2");
    var spy = sinon.spy(CreateSeasonForm.prototype, "removePlayer");

    removePlayerBtn.simulate("click");
    spy.calledOnce.should.be.true;
  });
});
