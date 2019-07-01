import React from "react";
import axios from "axios";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureTable from "./FixtureTable.js";
import CreateSeasonForm from "./CreateSeasonForm.js";

class App extends React.Component {
  state = { players: [], fixtures: [], activeSeason: "", refresh:false };

  componentDidMount = async () => {
    const response = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/"
    );

    this.setState({ players: response.data });

    const fixtures = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/fixture"
    );

    this.setState({ fixtures: fixtures.data });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.state.activeSeason !== prevState.activeSeason || this.state.refresh !== this.state.refresh) {
      const response = await axios.get(
        "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/"
      );

      this.setState({ players: response.data });

      const fixtures = await axios.get(
        "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/fixture"
      );

      this.setState({ fixtures: fixtures.data });
    }
  };

  createSeason = state => {
    state.players.map(async player => {
      await axios.post(
        "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/add/player",
        {
          seasonId: state.seasonName,
          staffName: player
        }
      );
    });
    this.setState({ activeSeason: state.seasonName });
    
    //To force componentDidUpdate
    this.setState({ refresh: !this.state.refresh})
  };

  render() {
    return (
      <div className="app">
        {/*<Seasons />*/}
        <Header />
        <SubNavBar current="Overview" />
        <div className="content">
          <div className="contentLeft">
            <LeagueTable players={this.state.players} />
          </div>
          <div className="contentRight">
            <FixtureTable fixtures={this.state.fixtures} />
            <CreateSeasonForm createSeason={this.createSeason} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
