import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import auth0Client from "../Auth";
import backend from "../api/backend";
import SubNavBar from "./nav/SubNavBar.js";
import Header from "./nav/Header.js";
import "../App.css";
import CreateSeasonForm from "./season/CreateSeasonForm.js";
import SeasonsList from "./season/SeasonsList.js";

const { WebClient } = require("@slack/web-api");

class SeasonsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      seasons: [],
      latestSeason: null
    };

    /* slack token */
    const token =
      "xoxp-685145909105-693344350935-691496978112-a5c73f958a992b52284cfcc86433895e";
    /* test channel */
    this.channel = "CLB0QN8JY";
    this.web = new WebClient(token);
  }

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

  getSeasonsList = async () => {
    const response = await backend.get("/api/89ball_season", {
      params: {
        type: this.state.type
      }
    });
    this.setState({ seasons: response.data });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.match.params.type });
    this.getSeasonsList();
    this.getLatestSeason();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.match.params.type !== prevProps.match.params.type) {
      await this.setState({ type: this.props.match.params.type });
      this.getSeasonsList();
      this.getLatestSeason();
    }
  };

  openPopUp = () => {
    this.refs.popup.style.display = "block";
    this.refs.container.style.display = "block";
  };

  closePopUp = () => {
    this.refs.popup.style.display = "none";
    this.refs.container.style.display = "none";
  };

  createSeason = async state => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth0Client.getIdToken()}`
      };

      await backend.post(
        "/api/89ball_league/add/players",
        {
          type: parseInt(this.state.type),
          seasonId: parseInt(state.seasonName),
          staffs: state.players
        },
        {
          headers: headers
        }
      );

      await backend
        .post(
          "/api/89ball_fixture/generate/",
          {
            type: parseInt(this.state.type),
            seasonId: parseInt(state.seasonName)
          },
          {
            headers: headers
          }
        )
        .then(async () => {
          this.toastSuccess("Season Created");
          this.getSeasonsList();
          this.getLatestSeason();
          await backend.post(
            "/api/slack/newSeason",
            {
              type: parseInt(this.state.type, 10),
              seasonName: state.seasonName
            },
            {
              headers: headers
            }
          );
        });
    } catch (e) {
      if (e.response.status === 401) {
        this.toastUnauthorised();
      }
      if (e.response.status === 400) {
        this.toastError("Something went wrong. Please try again");
      }
    }
  };

  deleteSeason = async id => {
    await backend
      .delete("/api/89ball_season/delete/", {
        data: {
          type: parseInt(this.state.type),
          seasonId: parseInt(id)
        },
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      })
      .then(() => {
        this.toastSuccess("Deleted");
        this.getSeasonsList();
        this.getLatestSeason();
      })
      .catch(e => {
        if (e.response.status === 401) {
          this.toastUnauthorised();
        }
      });
  };

  toastUnauthorised = () => {
    toast.error("⛔ Unauthorised! Please login", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
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
    toast.success(`✅ ${message}!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  render() {
    return (
      <div id="seasons">
        <ToastContainer />
        <Header />
        <SubNavBar
          latestSeason={this.state.latestSeason}
          type={this.state.type}
        />
        <div className="content">
          <div id="seasonsListContainer">
            <SeasonsList
              type={this.state.type}
              seasons={this.state.seasons}
              deleteSeason={this.deleteSeason}
            />
            <br />
            <button
              type="button"
              id="addSeasonBtn"
              onClick={() => {
                if (auth0Client.isAuthenticated()) {
                  this.openPopUp();
                } else {
                  this.toastUnauthorised();
                }
              }}
            >
              + Add new season
            </button>
          </div>
          <div className="popup-container" id="container" ref="container">
            <div className="form-popup" id="popup" ref="popup">
              <CreateSeasonForm
                seasons={this.state.seasons}
                type={this.state.type}
                createSeason={this.createSeason}
                closePopUp={() => this.closePopUp()}
              />
              <button
                type="button"
                id="cancelbtn"
                onClick={() => this.closePopUp()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SeasonsPage);
