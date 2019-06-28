import React from "react";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import FixtureTable from "./FixtureTable.js";
import LeagueTable from "./LeagueTable.js";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar />
        <div className="content">
          <div className="contentLeft">
            <LeagueTable />
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
