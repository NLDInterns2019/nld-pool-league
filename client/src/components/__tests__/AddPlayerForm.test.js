import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AddPlayerForm from "../league/AddPlayerForm";
import sinon from "sinon";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapper = shallow(<AddPlayerForm />);

describe("AddPlayerForm component", () => {
  it("should render", () => {
    expect(wrapper.exists()).to.be.true;
  });
});
