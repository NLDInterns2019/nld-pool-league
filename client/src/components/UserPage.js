import React from "react";
import backend from "../api/backend";
import auth0Client from "../Auth";
import { ToastContainer, toast } from "react-toastify";

import Header from "./nav/Header";
import SubNavBar from "./nav//SubNavBar";
import SeasonAccordion from "./userPage/SeasonAccordion";
import UpcomingMatch from "./userPage/UpcomingMatch";

import Axios from "axios";
import UnpaidSeasonsTableHeader from "./userPage/UnpaidSeasonsTableHeader";
import UnpaidSeasonsTableBody from "./userPage/UnpaidSeasonsTableBody";

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
              <p>
                You have played <b>99</b> matches
              </p>
              <p>
                Your winning rate is <b>50%</b>
              </p>
              <div className="unpaid-seasons">
                <p>You have outstanding payments for:</p>
                <table cellSpacing="0" id="unpaid-seasons-table">
                  <UnpaidSeasonsTableHeader />
                  <UnpaidSeasonsTableBody unpaid={this.state.unpaid} />
                </table>
              </div>
            </div>
            <div className="content">
              <div className="contentLeft">
                <SeasonAccordion type="8" staffName={this.state.player} />
                <br />
                <SeasonAccordion type="9" staffName={this.state.player} />
              </div>
              <div className="contentRight">
                <div className="arrangedFixturesContainer">
                  {this.state.bookings.length ? (
                    <UpcomingMatch bookings={this.state.bookings} />
                  ) : (
                    <h3>You have no arranged fixtures</h3>
                  )}
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
