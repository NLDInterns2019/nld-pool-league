import React from "react";
import backend from "../api/backend";

import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureList from "./FixtureList.js";
import SubmitScoreForm from "./SubmitScoreForm.js";

class App extends React.Component {
  state = {
    players: [],
    fixtures: [],
    activeSeason: 0,
    refresh: "false",
    windowWidth: 1400,
    groupCount: 0
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

    const count = await backend.get(
      "/api/8ball_fixture/group/" + this.state.activeSeason
    );

    this.setState({ groupCount: count.data[0] });
  };

  updateDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  componentDidMount = async () => {
    await this.setState(this.props.location.state);
    this.updateData();
    this.updateDimensions();
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
      )
      .catch(e=>{
        window.alert("ERROR: Match not found / match is finished")
      })
  };

  render() {
    //HELP TO CHECK STATE
    //console.log(this.state);

    if (this.state.windowWidth >= 1400) {
      return (
        <div className="app">
          <Header />
          <SubNavBar />
          <div className="content">
            <div className="contentLeft">
              <LeagueTable players={this.state.players} />
              <SubmitScoreForm changeFixtureScore={this.changeFixtureScore} />
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
    } else {
      return (
        <div className="app">
          <Header />
          <SubNavBar />
          <div className="content-centre">
            <LeagueTable players={this.state.players} />
            <SubmitScoreForm changeFixtureScore={this.changeFixtureScore} />
            <FixtureList
                fixtures={this.state.fixtures}
                groupCount={this.state.groupCount}
              />
          </div>
        </div>
      );
    }
  }
}

export default App;
