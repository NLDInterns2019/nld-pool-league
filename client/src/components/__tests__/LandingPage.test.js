import React from "react";
import chai, { expect, should } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount, render, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LandingPage from "../LandingPage.js";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("LandingPage component", () => {
  it("should render", () => {
    const wrapper = shallow(<LandingPage />);
    wrapper.exists().should.be.true;
  });
});
