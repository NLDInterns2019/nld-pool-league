import React, { Component } from "react";
import backend from "../api/backend";

import Header from "./Header";
import SubNavBar from "./SubNavBar";
import FixtureList from "./FixtureList";
import ViewYourFixtures from "./ViewYourFixtures";
import ArrangeFixture from "./ArrangeFixture";

class FixturesPage extends Component {
  state = {
    windowWidth: 1400,
    fixtures: [],
    groupCount: 0,
    refresh: false
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  viewFixtures = async (seasonId, staffName) => {
    const fixtures = await backend.get("/api/8ball_fixture/" + seasonId + "/" + staffName);

    this.setState({ fixtures: fixtures.data });

    const count = await backend.get("/api/8ball_fixture/group/" + seasonId);

    this.setState({ groupCount: count.data[0] });
  };

  render() {
    if (this.state.windowWidth >= 1400) {
      return (
        <div className="fixtures">
          <Header />
          <SubNavBar />
          <div className="content">
            <div className="contentLeft">
                <ViewYourFixtures viewFixtures={this.viewFixtures} />
                <FixtureList
                  fixtures={this.state.fixtures}
                  groupCount={this.state.groupCount}
                />
            </div>
            <div className="contentRight">
              {/*<SubmitScoreForm />*/}
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
            <ViewYourFixtures viewFixtures={this.viewFixtures} />
            <ArrangeFixture />
          </div>
        </div>
      );
    }
  }
}
export default FixturesPage;
