import React, { Component } from "react";
import backend from "../api/backend";

import Header from "./nav/Header";
import SubNavBar from "./nav/SubNavBar";
import ArrangeFixture from "./fixture/ArrangeFixture";

class FixturesPage extends Component {
  state = {
    type: "",
    fixtures: [],
    groupCount: 0,
    refresh: false,
    activeSeason: 0,
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type, activeSeason: this.props.match.params.seasonId});
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
        <SubNavBar activeSeason={this.state.activeSeason} type={this.state.type} />
        <div className="content">
          <ArrangeFixture />
        </div>
      </div>
    );
  }
}
export default FixturesPage;
