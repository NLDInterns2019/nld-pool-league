import React, { Component } from "react";
import backend from "../api/backend";
import SubNavBar from "./SubNavBar.js";
import Header from "./Header.js";
import "../App.css";
import CreateSeasonForm from "./CreateSeasonForm.js";
import SeasonsList from "./SeasonsList.js";

class SeasonsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      seasons: [],
      refresh: false
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
    await this.setState(this.props.location.state);
    this.getSeasonsList();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      this.state.refresh !== prevState.refresh ||
      this.props.location.state !== prevProps.location.state
    ) {
      await await this.setState(this.props.location.state);
      this.getSeasonsList();
    }
  };

  openPopUp() {
    this.refs.popup.style.display = "block";
    this.refs.container.style.display = "block";
  }

  closePopUp() {
    this.refs.popup.style.display = "none";
    this.refs.container.style.display = "none";
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
      .then(() =>
        this.setState({
          //To force update
          refresh: !this.state.refresh
        })
      )
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

    this.setState({
      //To force update
      refresh: !this.state.refresh
    });
  };

  render() {
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
            <button
              type="button"
              id="addSeasonBtn"
              onClick={this.openPopUp.bind(this)}
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
                closePopUp={this.closePopUp.bind(this)}
              />
              <button
                type="button"
                id="cancelbtn"
                onClick={this.closePopUp.bind(this)}
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

export default SeasonsPage;
