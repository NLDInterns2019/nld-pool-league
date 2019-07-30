import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import SeasonAccordion from "./userPage/SeasonAccordion";
import UpcomingMatch from "./userPage/UpcomingMatch";

import Axios from "axios";

class App extends React.Component {
  signal = Axios.CancelToken.source();
  state = {
    player: " ",
    fixtures: [],
    latestSeason: "",
    type: "",
    groupCount: 0,
    bookings: []
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

  getBookings = async () => {
    const bookings = await backend.get("/api/booking", {
      params: {
        staffName: this.state.player
      }
    });

    this.setState({ bookings: bookings.data });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
    if (auth0Client.isAuthenticated()) {
      this.setState({ player: auth0Client.getProfile().nickname }, () => {
        this.getBookings();
      });
    }
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
        {!auth0Client.isAuthenticated() ? (
          //If not logged in
          <h3 className="error" style={{ textAlign: "center" }}>
            You are not logged in
          </h3>
        ) : (
          //Logged In
          <div>
            <div
              style={{ width: "24rem", textAlign: "center", margin: "auto", marginBottom: "5rem" }}
            >
              <h3>
                Welcome back <strong>{this.state.player.toUpperCase()}</strong>
              </h3>
              <div style={{ fontSize: "1.2em", textAlign: "left" }}>
                <p>
                  You have played <b>99</b> matches
                </p>
                <p>
                  Your winning rate is <b>50%</b>
                </p>
              </div>
            </div>
            <div className="content">
              <div className="contentLeft">
                <SeasonAccordion type="8" staffName={this.state.player} />
                <br />
                <SeasonAccordion type="9" staffName={this.state.player} />
              </div>
              <div className="contentRight">
                {this.state.bookings.length ? (
                  <UpcomingMatch bookings={this.state.bookings} />
                ) : (
                  <h3>You have no upcoming matches</h3>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
