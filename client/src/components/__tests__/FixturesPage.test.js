import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import FixturesPage from "../FixturesPage.js";

chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("FixturePage component", () => {
  it("should render", () => {
    const wrapper = shallow(<FixturesPage />);
    wrapper.exists().should.be.true;
  });
});
