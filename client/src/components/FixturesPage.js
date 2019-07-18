import React, { Component } from "react";

import Header from "./nav/Header";
import SubNavBar from "./nav/SubNavBar";
import ArrangeFixture from "./fixture/ArrangeFixture";

class FixturesPage extends Component {
  state = {
    type: "",
    fixtures: [],
    groupCount: 0,
    refresh: false,
    activeSeason: 0
  };

  componentDidMount = async () => {
    await this.setState({
      type: this.props.match.params.type,
      activeSeason: this.props.match.params.seasonId
    });
  };

  render() {
    return (
      <div className="fixtures">
        <Header />
        <SubNavBar
          activeSeason={this.state.activeSeason}
          type={this.state.type}
        />
        <div className="content">
          <div className="content-centre">
            <ArrangeFixture type={this.state.type} activeSeason={this.state.activeSeason} />
          </div>
        </div>
      </div>
    );
  }
}
export default FixturesPage;
