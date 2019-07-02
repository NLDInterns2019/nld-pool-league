import React from "react";
import axios from "axios";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureTable from "./FixtureTable.js";
import CreateSeasonForm from "./CreateSeasonForm.js";
import SubmitScoreForm from "./SubmitScoreForm.js";

class App extends React.Component {
  state = { players: [], fixtures: [], activeSeason: "", refresh: "false" };

  updateData = async () => {
    const response = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/"
    );

    this.setState({ players: response.data });

    const fixtures = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/fixture"
    );

    this.setState({ fixtures: fixtures.data });
  };

  componentDidMount = () => {
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
          "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/generate/fixture"
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

  // changeFixtureScore = state ={

  // }

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

  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar current="Overview" />
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
