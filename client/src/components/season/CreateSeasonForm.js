import React, { Component } from "react";
import { orderBy, uniq, filter } from "lodash";
import auth0Client from "../../Auth";
import backend from "../../api/backend";
import Axios from "axios";

import { toast } from "react-toastify";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      auth0Players: [],
      playersName: [],
      seasonName: "",
      isAuthenticated: false
    };

    this.state = this.initialState;
  }
  signal = Axios.CancelToken.source();

  getPlayers = async () => {
    try {
      await backend
        .get("/api/89ball_season/playersdb", {
          cancelToken: this.signal.token,
          params: {},
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(res => {
          this.setState({
            auth0Players: orderBy(res.data, ["username"], ["asc"]),
            playersName: orderBy(res.data, ["username"], ["asc"])
              .filter(player => player.nickname !== "admin")
              .map(player => player.nickname),
            isAuthenticated: true
          });
        });
    } catch (e) {
      //API CALL BEING CANCELED
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuthenticated === false && auth0Client.isAuthenticated()) {
      this.getPlayers();
    }
  }

  componentWillUnmount() {
    this.signal.cancel("");
  }

  addPlayer() {
    this.setState({ playersName: [...this.state.playersName, ""] });
  }

  handleChange(e, indexToChange) {
    this.setState({
      playersName: this.state.playersName.map((player, index) => {
        if (index === indexToChange) {
          return e.target.value;
        }
        return player;
      })
    });
  }

  removePlayer(index) {
    this.state.playersName.splice(index, 1);
    this.setState({ playersName: this.state.playersName });
  }

  createSeason = () => {
    //SET STATE IS ASYNCHRONOUS
    this.setState({ players: this.preparePlayers() }, () => {
      this.props.createSeason(this.state);
      this.props.closePopUp();
      this.setState(this.initialState, () => {
        this.getPlayers();
      });
    });
  };

  preparePlayers() {
    let temp = [];
    this.state.playersName.map(
      playerName =>
        (temp = [
          ...temp,
          {
            type: parseInt(this.props.type),
            seasonId: parseInt(this.state.seasonName),
            staffName: playerName,
            form: "-----"
          }
        ])
    );
    return temp;
  }

  isValidSeason() {
    var regexSeasonNumber = /^[1-9]([0-9])*$/; // matches 1 number from 1 to 9 followed by 0 or more numbers from 0 to 9

    if (this.state.seasonName !== "") {
      let res = this.props.seasons.filter(
        season => season.seasonId === parseInt(this.state.seasonName)
      );
      if (res.length === 0 && regexSeasonNumber.test(this.state.seasonName)) {
        return true;
      }
    }
    return false;
  }

  isValidPlayersNumber() {
    /* check if the season name text input matches the regular expression, otherwise, check if there are less than 2 players inputted */
    if (this.state.playersName.length < 2) {
      return false;
    }

    return true;
  }

  isValidPlayers() {
    //No duplicate
    if (
      uniq(this.state.playersName).length === this.state.playersName.length &&
      !this.state.playersName.includes("")
    ) {
      return true;
    }
    return false;
  }

  /* displays button if inputs are valid, otherwise, hides it */
  createSeasonBtnStyle() {
    if (
      this.isValidSeason() &&
      this.isValidPlayersNumber() &&
      this.isValidPlayers()
    ) {
      return {
        display: "inline-block"
      };
    } else {
      return {
        display: "none"
      };
    }
  }

  checkPlayersNumberError() {
    if (this.isValidPlayersNumber()) {
      return null;
    } else {
      return <div className="error">Not enough players</div>;
    }
  }

  checkPlayersError() {
    if (this.isValidPlayers()) {
      return null;
    } else {
      return <div className="error">Invalid player(s)</div>;
    }
  }

  checkSeasonError() {
    if (this.isValidSeason()) {
      return null;
    } else {
      return <div className="error">Enter a valid season number</div>;
    }
  }

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

  render() {
    return (
      <div id="createSeasonForm">
        <h3>Create a Season</h3>
        <form>
          <label>Season number:</label>
          <input
            type="text"
            placeholder="Season number"
            value={this.state.seasonName}
            id="inputSeasonNo"
            onChange={e => this.setState({ seasonName: e.target.value })}
          />
          {this.checkSeasonError()}
          <div className="inputPlayers">
            {/* map the players in the state to inputs */}
            {this.state.playersName.map((player, index) => {
              return (
                <div key={index} className="form-row">
                  {/* Dropdown */}
                  <select
                    value={this.state.playersName[index]}
                    onChange={e => this.handleChange(e, index)}
                  >
                    {/* Dropdown selection */}
                    <option value="">Choose a player</option>
                    {this.state.playersName[index] !== "" ? (
                      <option value={this.state.playersName[index]}>
                        {this.state.playersName[index]}
                      </option>
                    ) : null}
                    {filter(
                      this.state.auth0Players,
                      p => !this.state.playersName.includes(p.username)
                    ).map(player => {
                      return (
                        <option key={player.username} value={player.username}>
                          {player.username}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    id={"button" + (index + 1)}
                    className="delete-icon"
                    alt="remove player"
                    onClick={() => this.removePlayer(index)}
                  />
                </div>
              );
            })}
            {this.checkPlayersNumberError()}
            {this.checkPlayersError()}
            {/* button for adding a player */}
            <button
              type="button"
              id="addPlayer"
              onClick={e => this.addPlayer(e)}
            >
              + Add player
            </button>
            <button
              type="button"
              id="createSeasonBtn"
              onClick={this.createSeason}
              style={this.createSeasonBtnStyle()}
            >
              Create season
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateSeasonForm;
