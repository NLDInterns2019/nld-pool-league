import React from "react";
import chai, { expect, should } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount, render, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SeasonsPage from "../SeasonsPage.js";
should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("SeasonsPage component", () => {
  it("should render", () => {
    const wrapper = shallow(<SeasonsPage />);
    wrapper.exists().should.be.true;
  });
});
