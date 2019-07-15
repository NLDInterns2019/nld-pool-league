import React, { Component } from "react";
import backend from "../api/backend";

import Header from "./nav/Header";
import SubNavBar from "./nav/SubNavBar";
import FixtureList from "./fixture/FixtureList";
import ViewYourFixtures from "./fixture/ViewYourFixtures";
import ArrangeFixture from "./fixture/ArrangeFixture";

class FixturesPage extends Component {
  state = {
    type: "",
    fixtures: [],
    groupCount: 0,
    refresh: false
  };

  componentDidMount = async () => {
    await this.setState(this.props.location.state);
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      this.state.type !== prevState.type ||
      this.props.location.state !== prevProps.location.state
    ) {
      await this.setState(this.props.location.state);
    }
  };

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
  }
}
export default FixturesPage;
