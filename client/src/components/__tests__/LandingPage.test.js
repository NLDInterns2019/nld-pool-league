import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LandingPage from "../LandingPage.js";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("Rendering", () => {
  it("should render", () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find("#eightBallLink").exists()).to.be.true;
    expect(wrapper.find("#nineBallLink").exists()).to.be.true;
    // expect(wrapper.find("#billiardsLink").exists()).to.be.true;
  });
});
