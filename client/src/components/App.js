import React from "react";
import axios from "axios";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import LeagueTable from "./LeagueTable.js";
import FixtureTable from "./FixtureTable.js";

class App extends React.Component {
  state = { players: [], fixtures: [] };

  componentDidMount = async () => {
    const response = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/"
    );

    this.setState({ players: response.data });
    console.log(this.state.players)

    const fixtures = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/fixture"
    );

    console.log(fixtures.data)
    this.setState({ fixtures: fixtures.data });
  };

  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar />
        <div className="content">
          <div className="contentLeft">
            <LeagueTable players={this.state.players} />
          </div>
          <div className="contentRight">
            <FixtureTable fixtures={this.state.fixtures} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
