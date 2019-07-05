import React from "react";
import Enzyme, { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import FixturesPage from "../FixturesPage.js";
import { assert, expect, should } from "chai";
should();

configure({ adapter: new Adapter() });

describe("SeasonsPage component", () => {
  it("should render", () => {
    const wrapper = shallow(<FixturesPage />);
    wrapper.exists().should.be.true;
  });
});
