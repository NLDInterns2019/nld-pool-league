import React from "react";
import chai, { expect, should } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount, render, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CreateSeasonForm from "../CreateSeasonForm.js";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("Rendering", () => {
  it("should render the different elements", () => {
    const wrapper = shallow(<CreateSeasonForm />);
    const addPlayerBtn = wrapper.find("#addPlayer");
    const inputSeasonNo = wrapper.find("#inputSeasonNo");

    wrapper.exists().should.be.true;
    addPlayerBtn.exists().should.be.true;
    inputSeasonNo.exists().should.be.true;
  });
});

describe("Add a Player", () => {
  it("should add a player to the state", () => {
    const wrapper = shallow(<CreateSeasonForm />);
    const addPlayerBtn = wrapper.find("#addPlayer");
    const inputSeasonNo = wrapper.find("#inputSeasonNo");

    // the state should have no players in it
    wrapper.state().players.should.have.lengthOf(0);

    // enter "1" as the season number and then click 'add player'
    inputSeasonNo.simulate("keypress", { key: 1 });
    addPlayerBtn.simulate("click");
    wrapper.state().players.should.have.lengthOf(1);
  });
});

describe("Remove a Player", () => {
  it("should remove a player from the state", () => {
    const wrapper = shallow(<CreateSeasonForm />);
    const addPlayerBtn = wrapper.find("#addPlayer");
    const inputSeasonNo = wrapper.find("#inputSeasonNo");

    // enter 1 as the season number and add 2 players
    inputSeasonNo.simulate("keypress", { key: 1 });
    addPlayerBtn.simulate("click");
    addPlayerBtn.simulate("click");

    const removePlayerBtn = wrapper.find("#button1");

    // there should be 2 players in the state
    wrapper.state().players.should.have.lengthOf(2);

    // click a remove button and there should be 1 player in the state
    removePlayerBtn.simulate("click");
    wrapper.state().players.should.have.lengthOf(1);
  });
});
