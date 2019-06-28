import React from "react";
import axios from "axios";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import FixtureTable from "./FixtureTable.js";
import LeagueTable from "./LeagueTable.js";
import Seasons from "./Seasons.js";

class App extends React.Component {
  state = { players: [] };

  componentDidMount = async () => {
    const response = await axios.get(
      "http://nldpoolleaguebackend.azurewebsites.net/api/8ball_league/"
    );

    this.setState({ players: response.data });
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
            <FixtureTable />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
