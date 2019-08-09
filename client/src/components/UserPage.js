import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import SeasonAccordion from "./userPage/SeasonAccordion";
import UpcomingMatch from "./userPage/UpcomingMatch";

import Axios from "axios";
import CurrentStats from "./userPage/CurrentStats";
import AllTimeStats from "./userPage/AllTimeStats";

class UserPage extends React.Component {
  signal = Axios.CancelToken.source();
  state = {
    player: " ",
    fixtures: [],
    latestSeason: "",
    type: "",
    groupCount: 0,
    bookings: [],
    unpaid: [],
    isAuthenticated: false
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
    const bookings = await backend.get("/api/booking/upcoming", {
      params: {
        staffName: this.state.player
      }
    });

    this.setState({ bookings: bookings.data });
  };

  getUnpaidSeasons = async () => {
    const unpaid = await backend.get("/api/kitty/unpaid", {
      params: {
        staffName: this.state.player
      }
    });
    this.setState({ unpaid: unpaid.data });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    await this.getLatestSeason();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuthenticated === false && auth0Client.isAuthenticated()) {
      this.setState(
        { player: auth0Client.getProfile().nickname, isAuthenticated: true },
        () => {
          this.getBookings();
          this.getUnpaidSeasons();
        }
      );
    }
  }

  componentWillUnmount() {
    this.signal.cancel("");
  }

  toastUnauthorised = () => {
    toast.error(
      <div className="toast">
        <div className="no-entry-icon" alt="no entry" />
        <p>Unauthorised! Please log in</p>
      </div>,
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

  toastSuccess = message => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  unpaidEightBallMessage = () => {
    const unpaidSeasons = this.state.unpaid;
    const unpaidEightBallSeasons = [];

    for (var i = unpaidSeasons.length - 1; i >= 0; i--) {
      if (unpaidSeasons[i].type === 8) {
        unpaidEightBallSeasons.push(unpaidSeasons[i]);
      }
    }
    if (unpaidEightBallSeasons.length > 0) {
      return (
        <div className="unpaid-seasons-message">
          <div className="unpaid-season-title">
            <div className="eight-ball-icon" alt="eight ball" />
            <h3>Payments Due:</h3>
          </div>
          <div className="unpaid-seasons-list">
            <div className="unpaid-eight-ball">
              {unpaidEightBallSeasons.map(season => {
                return (
                  <div
                    key={season.seasonId + season.type}
                    className="unpaid-item"
                  >
                    Season {season.seasonId}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="unpaid-total">
            Total: £{unpaidEightBallSeasons.length}.00
          </div>
        </div>
      );
    } else {
      return;
    }
  };

  unpaidNineBallMessage = () => {
    const unpaidSeasons = this.state.unpaid;
    const unpaidNineBallSeasons = [];

    for (var i = unpaidSeasons.length - 1; i >= 0; i--) {
      if (unpaidSeasons[i].type === 9) {
        unpaidNineBallSeasons.push(unpaidSeasons[i]);
      }
    }
    if (unpaidNineBallSeasons.length > 0) {
      return (
        <div className="unpaid-seasons-message">
          <div className="unpaid-season-title">
            <div className="nine-ball-icon" alt="nine ball" />
            <h3>Payments Due:</h3>
          </div>
          <div className="unpaid-seasons-list">
            <div className="unpaid-nine-ball">
              {unpaidNineBallSeasons.map(season => {
                return (
                  <div
                    key={season.seasonId + season.type}
                    className="unpaid-item"
                  >
                    Season {season.seasonId}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="unpaid-total">
            Total: £{unpaidNineBallSeasons.length}.00
          </div>
        </div>
      );
    } else {
      return;
    }
  };

  getPlayerForm = forms => {
    let formsToBeDisplayed = [];
    if (!forms) {
      forms = "-----";
    }
    for (let i = 0; i < forms.length; i++) {
      if (forms.charAt(i) === "W") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="win-icon" alt="win" />
          </div>
        );
      }
      if (forms.charAt(i) === "D") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="draw-icon" alt="draw" />
          </div>
        );
      }
      if (forms.charAt(i) === "L") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="loss-icon" alt="loss" />
          </div>
        );
      }
      if (forms.charAt(i) === "-") {
        formsToBeDisplayed = formsToBeDisplayed.concat(
          <div key={i} className="form-item">
            <div className="no-game-icon" alt="no game" />
          </div>
        );
      }
    }
    return formsToBeDisplayed;
  };

  getLeaguePos = () => {
    return <h4>1st</h4>;
  };

  getPPG = () => {
    return <h4>2.24</h4>;
  };

  getWinPercentage = () => {
    return <h4>54%</h4>;
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
          <div style={{ textAlign: "center" }}>
            <div className="player-info">
              <h3>
                Welcome back <strong>{this.state.player.toUpperCase()}</strong>
              </h3>
              {this.unpaidEightBallMessage()}
              {this.unpaidNineBallMessage()}
            </div>
            <div className="content">
              <div className="contentLeft">
                <div className="summary-title">
                  <div className="eight-ball-icon" alt="eight ball" />
                  <h3>8-Ball Summary</h3>
                  <div className="eight-ball-icon" alt="eight ball" />
                </div>
                <div className="summary-container">
                  <div className="stats-container">
                    <CurrentStats
                      getLeaguePos={this.getLeaguePos()}
                      getPlayerForm={this.getPlayerForm()}
                    />
                    <AllTimeStats
                      getPPG={this.getPPG()}
                      getWinPercentage={this.getWinPercentage()}
                    />
                  </div>
                  <SeasonAccordion type="8" staffName={this.state.player} />
                  <div className="arrangedFixturesContainer">
                    {this.state.bookings.length ? (
                      <UpcomingMatch bookings={this.state.bookings} />
                    ) : (
                      <h4>You have no arranged fixtures</h4>
                    )}
                  </div>
                </div>
              </div>
              <div className="contentRight">
                <div className="summary-title">
                  <div className="nine-ball-icon" alt="nine ball" />
                  <h3>9-Ball Summary</h3>
                  <div className="nine-ball-icon" alt="nine ball" />
                </div>
                <div className="summary-container">
                  <div className="stats-container">
                    <CurrentStats
                      getLeaguePos={this.getLeaguePos()}
                      getPlayerForm={this.getPlayerForm()}
                    />
                    <AllTimeStats
                      getPPG={this.getPPG()}
                      getWinPercentage={this.getWinPercentage()}
                    />
                  </div>
                  <SeasonAccordion type="9" staffName={this.state.player} />
                  <div className="arrangedFixturesContainer">
                    {this.state.bookings.length ? (
                      <UpcomingMatch bookings={this.state.bookings} />
                    ) : (
                      <h4>You have no arranged fixtures</h4>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPage;
