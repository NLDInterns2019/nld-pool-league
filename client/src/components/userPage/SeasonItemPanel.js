import React from "react";
import backend from "../../api/backend";
import { AccordionItemPanel } from "react-accessible-accordion";

import FixtureList from "../fixture/FixtureList";

import "../../accordion.css";

import Axios from "axios";

class SeasonItemPanel extends React.Component {
  state = {
    type: "",
    staffName: " ",
    activeSeason: 0,
    unplayedSeasons: [],
    fixtures: [],
    groupCount: 0
  };

  signal = Axios.CancelToken.source();

  getUnplayedFixtures = async () => {
    const fixtures = await backend.get(
      "/api/89ball_fixture/" + this.state.activeSeason,
      {
        cancelToken: this.signal.token,
        params: {
          type: this.state.type,
          staffName: this.state.staffName,
          hidePlayed: true,
          showLess: true,
        }
      }
    );

    this.setState({ fixtures: fixtures.data });
  };

  getGroupCount = async () => {
    const count = await backend.get(
      "/api/89ball_fixture/group/" + this.state.activeSeason,
      {
        cancelToken: this.signal.token,
        params: {
          type: this.state.type
        }
      }
    );

    this.setState({ groupCount: count.data[0] });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.type });
    await this.setState({ staffName: this.props.staffName });
    await this.setState({ activeSeason: this.props.seasonId });

    this.getUnplayedFixtures();
    this.getGroupCount();
  };

  render() {
    return (
      <AccordionItemPanel>
        <FixtureList
          fixtures={this.state.fixtures}
          groupCount={this.state.groupCount}
        />
      </AccordionItemPanel>
    );
  }
}

export default SeasonItemPanel;
