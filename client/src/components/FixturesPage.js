import React, { Component } from "react";
import backend from "../api/backend";

import Header from "./Header";
import SubNavBar from "./SubNavBar";
import FixtureList from "./FixtureList";
import ViewYourFixtures from "./ViewYourFixtures";
import ArrangeFixture from "./ArrangeFixture";

class FixturesPage extends Component {
  state = {
    type: "",
    windowWidth: 1400,
    fixtures: [],
    groupCount: 0,
    refresh: false
  };

  componentDidMount = async () => {
    await this.setState(this.props.location.state);
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      this.state.type !== prevState.type ||
      this.props.location.state !== prevProps.location.state
    ) {
      await this.setState(this.props.location.state);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  viewFixtures = async (seasonId, staffName) => {
    const fixtures = await backend.get(
      "/api/89ball_fixture/" + seasonId + "/" + staffName,
      {
        params: {
          type: this.state.type
        }
      }
    );

    this.setState({ fixtures: fixtures.data });

    const count = await backend.get("/api/89ball_fixture/group/" + seasonId, {
      params: {
        type: this.state.type
      }
    });

    this.setState({ groupCount: count.data[0] });
  };

  render() {
    if (this.state.windowWidth >= 1400) {
      return (
        <div className="fixtures">
          <Header />
          <SubNavBar type={this.state.type} />
          <div className="content">
            <div className="contentLeft">
              <div>
                <ViewYourFixtures
                  type={this.state.type}
                  viewFixtures={this.viewFixtures}
                />
                <FixtureList
                  fixtures={this.state.fixtures}
                  groupCount={this.state.groupCount}
                />
              </div>
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
          <SubNavBar type={this.state.type} />
          <div className="content">
            <div className="content-centre">
              <ViewYourFixtures
                type={this.state.type}
                viewFixtures={this.viewFixtures}
              />
              <ArrangeFixture />
            </div>
          </div>
        </div>
      );
    }
  }
}
export default FixturesPage;
