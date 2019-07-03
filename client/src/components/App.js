import React from "react";
import axios from "axios";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureTable from "./FixtureTable.js";
import CreateSeasonForm from "./CreateSeasonForm.js";
import SubmitScoreForm from "./SubmitScoreForm.js";

class App extends React.Component {
  state = { players: [], fixtures: [], activeSeason: 0, refresh: "false" };

  updateData = async () => {
    const response = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/" +
        this.state.activeSeason
    );

    this.setState({ players: response.data });

    const fixtures = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_fixture/" +
        this.state.activeSeason
    );

    this.setState({ fixtures: fixtures.data });
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

  createSeason = state => {
    Promise.all(
      state.players.map(player =>
        axios.post(
          "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/add/player",
          {
            seasonId: state.seasonName,
            staffName: player
          }
        )
      )
    )
      .then(() =>
        axios.post(
          "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/generate/fixture",
          {
            seasonId: state.seasonName
          }
        )
      )
      .then(() =>
        this.setState({
          activeSeason: state.seasonName,
          //To force update
          refresh: !this.state.refresh
        })
      );
  };

  // //ALTERNATIVE
  // createSeason = async state => {
  //   await Promise.all(
  //     state.players.map(player =>
  //       axios.post(
  //         "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/add/player",
  //         {
  //           seasonId: state.seasonName,
  //           staffName: player
  //         }
  //       )
  //     )
  //   );
  //   await axios.post("http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/generate/fixture");
  //   this.setState({
  //       activeSeason: state.seasonName,
  //       //To force update
  //       refresh: !this.state.refresh
  //     });
  // };

  changeFixtureScore = async state => {
    await axios
      .put(
        "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/edit/fixture",
        {
          seasonId: this.state.activeSeason,
          player1: state.player1,
          score1: state.score1,
          player2: state.player2,
          score2: state.score2
        }
      )
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
    return (
      <div className="app">
        <Header />
        <SubNavBar />
        <div className="content">
          <div className="contentLeft">
            <LeagueTable players={this.state.players} />
            <CreateSeasonForm createSeason={this.createSeason} />
          </div>
          <div className="contentRight">
            <SubmitScoreForm changeFixtureScore={this.changeFixtureScore} />
            <FixtureTable fixtures={this.state.fixtures} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
