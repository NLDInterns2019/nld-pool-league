import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import SeasonsPage from "./components/SeasonsPage.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import FixturesPage from "./components/FixturesPage.js";
import LandingPage from "./components/LandingPage.js";
import Routes from "./components/Routes.js";

ReactDOM.render(
  <Router>
    <Routes />
  </Router>,
  document.getElementById("root")
);
