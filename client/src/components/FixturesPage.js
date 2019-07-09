import React, { Component } from "react";
import Header from "./Header";
import SubNavBar from "./SubNavBar";
import SubmitScoreForm from "./SubmitScoreForm";
import ViewYourFixtures from "./ViewYourFixtures";
import ArrangeFixture from "./ArrangeFixture";

class FixturesPage extends Component {
  state = {
    windowWidth: 1400
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  render() {
    if (this.state.windowWidth > 1400) {
      return (
        <div className="fixtures">
          <Header />
          <SubNavBar />
          <div className="content">
            <div className="contentLeft">
              <ViewYourFixtures />
            </div>

            <div className="contentRight">
              <SubmitScoreForm />
              <ArrangeFixture />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="fixtures">
          <Header />
          <SubNavBar />
          <div className="content-centre">
            <ViewYourFixtures />
            <SubmitScoreForm />
            <ArrangeFixture />
          </div>
        </div>
      );
    }
  }
}
export default FixturesPage;
