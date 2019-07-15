import React from "react";
import backend from "../api/backend";

import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureList from "./fixture/FixtureList.js/index.js";
import SubmitScoreForm from "./league/SubmitScoreForm.js/index.js";

class App extends React.Component {
  state = {
    type: "",
    players: [],
    unplayedFixtures: [],
    fixtures: [],
    activeSeason: 0,
    refresh: "false",
    groupCount: 0
  };

  updateData = async () => {
    const response = await backend.get(
      "/api/89ball_league/" + this.state.activeSeason,
      {
        params: {
          type: this.state.type
        }
      }
    );

    this.setState({ players: response.data });

    const fixtures = await backend.get(
      "/api/89ball_fixture/" + this.state.activeSeason,
      {
        params: {
          type: this.state.type
        }
      }
    );

    this.setState({ fixtures: fixtures.data });

    const unplayedFixtures = await backend.get(
      "/api/89ball_fixture/unplayed/" + this.state.activeSeason,
      {
        params: {
          type: this.state.type
        }
      }
    );

    this.setState({ unplayedFixtures: unplayedFixtures.data });

    const count = await backend.get(
      "/api/89ball_fixture/group/" + this.state.activeSeason,
      {
        params: {
          type: this.state.type
        }
      }
    );

    this.setState({ groupCount: count.data[0] });
  };

  componentDidMount = async () => {
    await this.setState(this.props.location.state);
    this.updateData();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.refresh !== prevState.refresh) {
      this.updateData();
    }
  };

  changeFixtureScore = async state => {
    await backend
      .put("/api/89ball_fixture/edit", {
        type: this.state.type,
        seasonId: this.state.activeSeason,
        player1: state.player1,
        score1: parseInt(state.score1),
        player2: state.player2,
        score2: parseInt(state.score2)
      })
      .then(() =>
        this.setState({
          //To force update
          refresh: !this.state.refresh
        })
      )
      .catch(e => {
        window.alert("ERROR: Match not found / match is finished");
      });
  };

  render() {
    //HELP TO CHECK STATE
    //console.log(this.state);

    return (
      <div className="app">
        <Header />
        <SubNavBar type={this.state.type} />
        <div className="content">
          <div className="contentLeft">
            <LeagueTable
              activeSeason={this.state.activeSeason}
              players={this.state.players}
            />
            <SubmitScoreForm
              type={this.state.type}
              unplayedFixtures={this.state.unplayedFixtures}
              changeFixtureScore={this.changeFixtureScore}
            />
          </div>
          <div className="contentRight">
            <FixtureList
              fixtures={this.state.fixtures}
              groupCount={this.state.groupCount}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
