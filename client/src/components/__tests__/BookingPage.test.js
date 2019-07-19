import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import BookingPage from "../BookingPage.js";

chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe("FixturePage component", () => {
  it("should render", () => {
    const wrapper = shallow(<BookingPage />);
    wrapper.exists().should.be.true;
  });
});
