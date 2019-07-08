import React from "react";
import Enzyme, { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LandingPage from "../LandingPage.js";
import { assert, expect, should } from "chai";
should();

configure({ adapter: new Adapter() });

describe("SeasonsPage component", () => {
  it("should render", () => {
    const wrapper = shallow(<LandingPage />);
    wrapper.exists().should.be.true;
  });
});
