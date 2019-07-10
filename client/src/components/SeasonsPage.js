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
      seasons: [],
      refresh: false
    };
  }

  getSeasonsList = async () => {
    const response = await backend.get("/api/8ball_season");
    this.setState({ seasons: response.data });
  };

  componentDidMount() {
    this.getSeasonsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.refresh !== prevState.refresh) {
      this.getSeasonsList();
    }
  }

  openPopUp() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("container").style.display = "block";
  }

  closePopUp() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("container").style.display = "none";
  }

  createSeason = state => {
    console.log(state)
    backend
      .post("/api/8ball_league/add/players", {
        seasonId: parseInt(state.seasonName),
        staffs: state.players
      })
      .then(() =>
        backend.post("/api/8ball_fixture/generate/", {
          seasonId: parseInt(state.seasonName)
        })
      )
      .then(() =>
        this.setState({
          //To force update
          refresh: !this.state.refresh
        })
      );
  };

  // createSeason = state => {
  //   Promise.all(
  //     state.players.map(player =>
  //       backend.post(
  //         "/api/8ball_league/add/player",
  //         {
  //           seasonId: parseInt(state.seasonName),
  //           staffName: player
  //         }
  //       )
  //     )
  //   )
  //     .then(() =>
  //       backend.post(
  //         "/api/8ball_fixture/generate/",
  //         {
  //           seasonId: parseInt(state.seasonName)
  //         }
  //       )
  //     )
  //     .then(() =>
  //       this.setState({
  //         //To force update
  //         refresh: !this.state.refresh
  //       })
  //     );
  // };

  deleteSeason = async id => {
    await backend.delete("/api/8ball_season/delete/", {
      data: {
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
      <div className="seasons">
        <Header />
        <SubNavBar />
        <div className="content">
          <div className="seasonsListContainer">
            <SeasonsList
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
              <CreateSeasonForm createSeason={this.createSeason} />
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
