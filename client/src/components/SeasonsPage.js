import React, { Component } from "react";
import backend from "../api/backend";
import SubNavBar from "./nav/SubNavBar.js";
import Header from "./nav/Header.js";
import "../App.css";
import CreateSeasonForm from "./season/CreateSeasonForm.js";
import SeasonsList from "./season/SeasonsList.js";

class SeasonsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      seasons: []
    };
  }

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
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.match.params.type !== prevProps.match.params.type) {
      await this.setState({ type: this.props.match.params.type });
      this.getSeasonsList();
    }
  };

  openPopUp() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("container").style.display = "block";
  }

  closePopUp() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("container").style.display = "none";
  }

  createSeason = state => {
    backend
      .post("/api/89ball_league/add/players", {
        type: parseInt(this.state.type),
        seasonId: parseInt(state.seasonName),
        staffs: state.players
      })
      .then(() =>
        backend.post("/api/89ball_fixture/generate/", {
          type: parseInt(this.state.type),
          seasonId: parseInt(state.seasonName)
        })
      )
      .then(() => this.getSeasonsList())
      .catch(e => {
        window.alert("ERROR: Cannot add player(s) to an existing season!");
      });
  };

  deleteSeason = async id => {
    await backend.delete("/api/89ball_season/delete/", {
      data: {
        type: parseInt(this.state.type),
        seasonId: parseInt(id)
      }
    });
    this.getSeasonsList();
  };

  render() {
    //console.log(this.state)
    return (
      <div id="seasons">
        <Header />
        <SubNavBar type={this.state.type} />
        <div className="content">
          <div id="seasonsListContainer">
            <SeasonsList
              type={this.state.type}
              seasons={this.state.seasons}
              deleteSeason={this.deleteSeason}
            />
            <br />
            <button type="button" id="addSeasonBtn" onClick={this.openPopUp}>
              + Add new season
            </button>
          </div>
          <div className="popup-container" id="container">
            <div className="form-popup" id="popup">
              <CreateSeasonForm
                seasons={this.state.seasons}
                type={this.state.type}
                createSeason={this.createSeason}
              />
              <button type="button" id="cancelbtn" onClick={this.closePopUp}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SeasonsPage;
