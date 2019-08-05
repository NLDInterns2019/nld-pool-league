import React from "react";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SeasonsPage from "../SeasonsPage.js";

chai.should();

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const wrapperSeasonsPage = shallow(<SeasonsPage />);

describe("SeasonsPage component", () => {
  it("should render", () => {
    wrapperSeasonsPage.exists().should.be.true;
  });
});

describe("Popups", () => {
  it("should open when openPopUp() is run", () => {
    wrapperSeasonsPage.instance().refs = {
      popup: { style: { display: "none" } },
      container: { style: { display: "none" } }
    };

    wrapperSeasonsPage.instance().openPopUp();

    wrapperSeasonsPage
      .instance()
      .refs.popup.style.display.should.equal("block");
    wrapperSeasonsPage
      .instance()
      .refs.container.style.display.should.equal("block");
  });

  it("should close when closePopUp() is run", () => {
    wrapperSeasonsPage.instance().refs = {
      popup: { style: { display: "block" } },
      container: { style: { display: "block" } }
    };

    wrapperSeasonsPage.instance().closePopUp();

    wrapperSeasonsPage.instance().refs.popup.style.display.should.equal("none");
    wrapperSeasonsPage
      .instance()
      .refs.container.style.display.should.equal("none");
  });
});
