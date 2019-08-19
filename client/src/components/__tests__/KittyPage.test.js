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

describe("showTransactionForm", () => {
  it("should open transaction form when function run", () => {
    wrapper.instance().transactionForm = {
      current: {
        style: {
          display: "none"
        }
      }
    };
    wrapper.instance().makeTransactionBtn = {
      current: {
        style: {
          display: "block"
        }
      }
    };

    wrapper.instance().showTransactionForm();

    expect(wrapper.instance().transactionForm.current.style.display).to.equal(
      "block"
    );
    expect(
      wrapper.instance().makeTransactionBtn.current.style.display
    ).to.equal("none");
  });

  it("should close transaction form when function run", () => {
    wrapper.instance().transactionForm = {
      current: {
        style: {
          display: "block"
        }
      }
    };
    wrapper.instance().makeTransactionBtn = {
      current: {
        style: {
          display: "none"
        }
      }
    };

    wrapper.instance().closeForm();

    expect(wrapper.instance().transactionForm.current.style.display).to.equal(
      "none"
    );
    expect(
      wrapper.instance().makeTransactionBtn.current.style.display
    ).to.equal("block");
  });
});
