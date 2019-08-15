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
const addPlayerBtn = wrapper.find("#addPlayerBtn");
const confirmBtn = wrapper.find("#confirmBtn");
const cancelBtn = wrapper.find("#cancelBtn");

describe("AddPlayerForm component", () => {
  it("should render", () => {
    expect(wrapper.exists()).to.be.true;
  });
});

describe("handleClick()", () => {
  beforeEach(() => {
    wrapper.instance().hiddenForm = {
      current: {
        style: {
          display: "none"
        }
      }
    };

    wrapper.instance().addPlayerBtn = {
      current: {
        style: {
          display: "flex"
        }
      }
    };

    wrapper.instance().inputPlayer = {
      current: {
        value: "matthew"
      }
    };
  });
  it("should open the form when addPlayerBtn is clicked", () => {
    addPlayerBtn.simulate("click");
    expect(wrapper.instance().hiddenForm.current.style.display).to.equal(
      "flex"
    );
    expect(wrapper.instance().hiddenForm.current.style.flexDirection).to.equal(
      "column"
    );
    expect(wrapper.instance().hiddenForm.current.style.justifyContent).to.equal(
      "center"
    );
  });

  it("should hide addPlayerBtn when addPlayerBtn is clicked", () => {
    addPlayerBtn.simulate("click");
    expect(wrapper.instance().addPlayerBtn.current.style.display).to.equal(
      "none"
    );
  });

  it("should hide the form when cancel is clicked", () => {
    addPlayerBtn.simulate("click");
    cancelBtn.simulate("click");

    expect(wrapper.instance().hiddenForm.current.style.display).to.equal(
      "none"
    );
  });
});
