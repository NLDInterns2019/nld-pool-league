import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import HeaderNavigator from "../nav/HeaderNavigator.js";

chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const header = shallow(<HeaderNavigator />);
const eightBallLink = header.find("#eightBallLink");
const nineBallLink = header.find("#nineBallLink");
const billiardsLink = header.find("#billiardsLink");

describe("Rendering", () => {
  it("should render the different elements", () => {
    eightBallLink.exists().should.be.true;
    nineBallLink.exists().should.be.true;
    billiardsLink.exists().should.be.true;
  });
});
