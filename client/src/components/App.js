import React from "react";
import {
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import LandingPage from "./LandingPage.js";
import LeaguePage from "./LeaguePage";
import SeasonsPage from "./SeasonsPage.js";
import BookingPage from "./BookingPage";
import HoFPage from "./HoFPage";
import NotFound from "./NotFound";

import Callback from "../Callback";

const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route
          path="/:type(8|9)-ball/overview/:seasonId?"
          component={LeaguePage}
        />
        <Route
          path="/:type(billiards)/overview/:seasonId?"
          component={LeaguePage}
        />
        <Route path="/:type(8|9)-ball/seasons" component={SeasonsPage} />
        <Route path="/:type(billiards)/seasons" component={SeasonsPage} />
        <Route path="/:type(8|9)-ball/hall_of_fame" component={HoFPage} />
        <Route path="/:type(billiards)/hall_of_fame" component={HoFPage} />
        <Route path="/:type(8|9)-ball/fixtures/:seasonId" component={BookingPage} />
        <Route path="/:type(billiards)/fixtures/:seasonId" component={BookingPage} />
        <Route path="/callback" component={Callback} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(App);
