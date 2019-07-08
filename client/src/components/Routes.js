import React from "react";
import { Route } from "react-router-dom";
import LandingPage from "./LandingPage.js";
import App from "./App.js";
import SeasonsPage from "./SeasonsPage.js";
import FixturesPage from "./FixturesPage.js";

const Routes = () => {
  return (
    <div>
      <Route exact path="/" component={LandingPage} />
      <Route path="*/overview" component={App} />
      <Route path="*/seasons" component={SeasonsPage} />
      <Route path="*/fixtures" component={FixturesPage} />
    </div>
  );
};

export default Routes;
