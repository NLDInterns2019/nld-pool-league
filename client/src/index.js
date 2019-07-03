import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import SeasonsPage from "./components/SeasonsPage.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import FixturesPage from "./components/FixturesPage.js";
import LandingPage from "./components/LandingPage.js";

ReactDOM.render(
  <Router>
    <Route exact path="/" component={LandingPage} />
    <Route path="*/overview" component={App} />
    <Route path="*/seasons" component={SeasonsPage} />
    <Route path="*/fixtures" component={FixturesPage} />
  </Router>,
  document.getElementById("root")
);
