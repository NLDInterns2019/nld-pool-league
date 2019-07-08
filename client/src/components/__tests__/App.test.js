import Enzyme, { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import App from "../App.js";
import { assert, expect, should } from "chai";
should();

configure({ adapter: new Adapter() });

describe("App component", () => {
  it("should render", () => {
    const wrapper = shallow(<App />);
    wrapper.exists().should.be.true;
  });
});
