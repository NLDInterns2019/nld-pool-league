import React from "react";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SeasonsPage from "../SeasonsPage.js";

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapperSeasonsPage = shallow(<SeasonsPage />);

describe("SeasonsPage component", () => {
  it("should render", () => {
    expect(wrapperSeasonsPage.exists()).to.be.true;
  });
});

describe("Popups", () => {
  it("should open when openPopUp() is run", () => {
    wrapperSeasonsPage.instance().refs = {
      popup: { style: { display: "none" } },
      container: { style: { display: "none" } }
    };

    wrapperSeasonsPage.instance().openPopUp();

    expect(wrapperSeasonsPage.instance().refs.popup.style.display).to.equal(
      "block"
    );
    expect(wrapperSeasonsPage.instance().refs.container.style.display).to.equal(
      "block"
    );
  });

  it("should close when closePopUp() is run", () => {
    wrapperSeasonsPage.instance().refs = {
      popup: { style: { display: "block" } },
      container: { style: { display: "block" } }
    };

    wrapperSeasonsPage.instance().closePopUp();

    expect(wrapperSeasonsPage.instance().refs.popup.style.display).to.equal(
      "none"
    );
    expect(wrapperSeasonsPage.instance().refs.container.style.display).to.equal(
      "none"
    );
  });
});
