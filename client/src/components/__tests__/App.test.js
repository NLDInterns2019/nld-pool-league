import React from "react";
import chai, { expect, should } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount, render, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "../App.js";
chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
describe("App component", () => {
  it("should render", () => {
    const wrapper = shallow(<App />);
    wrapper.exists().should.be.true;
  });
});
