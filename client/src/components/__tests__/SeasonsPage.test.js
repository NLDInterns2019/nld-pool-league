import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SeasonsPage from "../SeasonsPage.js";

chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapper = shallow(<SeasonsPage />);

describe("SeasonsPage component", () => {
  it("should render", () => {
    wrapper.exists().should.be.true;
    console.log("wrapper.instance(): ", wrapper.instance());
  });
});

describe("Popups", () => {
  it("should open when openPopUp() is run", () => {
    wrapper.instance().refs = {
      popup: { style: { display: "none" } },
      container: { style: { display: "none" } }
    };

    wrapper.instance().openPopUp();

    wrapper.instance().refs.popup.style.display.should.equal("block");
    wrapper.instance().refs.container.style.display.should.equal("block");
  });

  it("should close when closePopUp() is run", () => {
    wrapper.instance().refs = {
      popup: { style: { display: "block" } },
      container: { style: { display: "block" } }
    };

    wrapper.instance().closePopUp();

    wrapper.instance().refs.popup.style.display.should.equal("none");
    wrapper.instance().refs.container.style.display.should.equal("none");
  });
});
