import React from "react";
import Header from "./Header.js";
import SubNavBar from "./SubNavBar.js";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />
        <SubNavBar />
      </div>
    );
  }
}

export default App;
