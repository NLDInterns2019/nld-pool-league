import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import HeaderNavigator from "../HeaderNavigator.js";
import SubNavigator from "../SubNavigator.js";

chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const header = shallow(<HeaderNavigator />);
const sub = shallow(<SubNavigator />);
const seasonsLink = sub.find("#seasonsLink");
const fixturesLink = sub.find("#fixturesLink");
const eightBallLink = header.find("#eightBallLink");
const nineBallLink = header.find("#nineBallLink");
const billiardsLink = header.find("#billiardsLink");

describe("Rendering", () => {
  it("should render the different elements", () => {
    seasonsLink.exists().should.be.true;
    fixturesLink.exists().should.be.true;
    eightBallLink.exists().should.be.true;
    nineBallLink.exists().should.be.true;
    billiardsLink.exists().should.be.true;
  });
});
