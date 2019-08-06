import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import BookingPage from "../BookingPage.js";
import moment from "moment";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
const wrapper = shallow(<BookingPage />);

describe("FixturePage component", () => {
  it("should render", () => {
    expect(wrapper.exists()).to.be.true;
  });
});

describe("Selecting a slot", () => {
  it("should change the state correctly", () => {
    wrapper.setState({
      start: "",
      end: ""
    });

    const start = moment().set({
      date: 14,
      month: 8,
      year: 2023,
      hour: 15,
      minutes: 0
    });
    const end = moment().set({
      date: 14,
      month: 8,
      year: 2023,
      hour: 15,
      minutes: 30
    });

    wrapper.instance().handleSelect({ start, end });

    const expectedStart = start.toDate().toISOString();
    const expectedEnd = end.toDate().toISOString();

    expect(wrapper.state().start).to.equal(expectedStart);
    expect(wrapper.state().end).to.equal(expectedEnd);
  });
});

describe("Popups", () => {
  it("should open when openPopUp() is run", () => {
    wrapper.instance().refs = {
      popup: { style: { display: "none" } },
      container: { style: { display: "none" } }
    };

    wrapper.instance().openPopUp();

    expect(wrapper.instance().refs.popup.style.display).to.equal("block");
    expect(wrapper.instance().refs.container.style.display).to.equal("block");
  });

  it("should close when closePopUp() is run", () => {
    wrapper.instance().refs = {
      popup: { style: { display: "block" } },
      container: { style: { display: "block" } }
    };

    wrapper.instance().closePopUp();

    expect(wrapper.instance().refs.popup.style.display).to.equal("none");
    expect(wrapper.instance().refs.container.style.display).to.equal("none");
  });
});
