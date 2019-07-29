import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import LeagueTable from "./league/LeagueTable";
import FixtureList from "./fixture/FixtureList";
import SubmitScoreForm from "./fixture/SubmitScoreForm";
import ViewYourFixtures from "./fixture/ViewYourFixtures";
import FinalRankTable from "./league/FinalRankTable";
import FinalStat from "./league/FinalStat";

import Axios from "axios";

const { WebClient } = require("@slack/web-api");

class App extends React.Component {
  signal = Axios.CancelToken.source();
  state = {
    latestSeason: "",
    type: ""
  };

  getLatestSeason = async () => {
    const latest = await backend.get("/api/89ball_season/latest", {
      params: {
        type: this.state.type
      }
    });

    this.setState({
      latestSeason: latest.data[0].seasonId
    });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
  };

  componentWillUnmount() {
    this.signal.cancel("");
  }

  toastUnauthorised = () => {
    toast.error(
      <p>
        <span role="img" aria-label="forbidden">
          ⛔
        </span>{" "}
        Unauthorised! Please login
      </p>,
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    );
  };

  toastError = message => {
    toast.error(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  toastSucess = message => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  render() {
    return (
      <div className="app">
        <ToastContainer />
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="content">
          <div className="contentLeft">Content Left</div>
          <div className="contentRight">Content Right</div>
        </div>
      </div>
    );
  }
}

export default App;
