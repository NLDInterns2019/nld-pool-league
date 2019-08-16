import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import KittyPage from "../KittyPage";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapper = shallow(<KittyPage />);

describe("KittyPage component", () => {
  it("should render", () => {
    expect(wrapper.exists()).to.be.true;
  });
});
