import React from "react";
import backend from "../api/backend";

import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureTable from "./FixtureTable.js";
import SubmitScoreForm from "./SubmitScoreForm.js";

class App extends React.Component {
  state = {
    players: [],
    fixtures: [],
    activeSeason: 0,
    refresh: "false",
    windowWidth: 1400
  };

  updateData = async () => {
    const response = await backend.get(
      "/api/8ball_league/" + this.state.activeSeason
    );

    this.setState({ players: response.data });

    const fixtures = await backend.get(
      "/api/8ball_fixture/" + this.state.activeSeason
    );

    this.setState({ fixtures: fixtures.data });
  };

  updateDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  componentDidMount = async () => {
    await this.setState(this.props.location.state);
    this.updateData();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    console.log(this.state.windowWidth);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.refresh !== prevState.refresh) {
      this.updateData();
    }
  };

  changeFixtureScore = async state => {
    await backend
      .put("/api/8ball_fixture/edit", {
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
      );
  };

  render() {
    //HELP TO CHECK STATE
    //console.log(this.state);

    if (this.state.windowWidth > 1400) {
      return (
        <div className="app">
          <Header />
          <SubNavBar />
          <div className="content">
            <div className="contentLeft">
              <LeagueTable players={this.state.players} />
            </div>

            <div className="contentRight">
              <SubmitScoreForm changeFixtureScore={this.changeFixtureScore} />
              <FixtureTable fixtures={this.state.fixtures} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="app">
          <Header />
          <SubNavBar />
          <div className="content-centre">
            <LeagueTable players={this.state.players} />
            <SubmitScoreForm changeFixtureScore={this.changeFixtureScore} />
            <FixtureTable fixtures={this.state.fixtures} />
          </div>
        </div>
      );
    }
  }
}

export default App;
