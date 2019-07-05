import React from "react";
import Enzyme, { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SeasonsPage from "../SeasonsPage";

configure({ adapter: new Adapter() });

describe("SeasonsPage component", () => {
  it("should render", () => {
    const wrapper = shallow(<SeasonsPage />);

    expect(wrapper.exists()).toBe(true);
  });
});
