import React from "react";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";
import FixtureTable from "./FixtureTable.js";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar />
        <FixtureTable />
      </div>
    );
  }
}

export default App;
