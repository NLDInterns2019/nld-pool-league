import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage.js";
import LeaguePage from "./LeaguePage";
import SeasonsPage from "./SeasonsPage.js";
import FixturesPage from "./FixturesPage";
import NotFound from "./NotFound";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="*/overview" component={LeaguePage} />
          <Route path="*/seasons" component={SeasonsPage} />
          <Route path="*/fixtures" component={FixturesPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
