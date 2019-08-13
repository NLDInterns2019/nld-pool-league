import React, { Component } from "react";
import { orderBy, uniq, filter } from "lodash";
import auth0Client from "../../Auth";
import backend from "../../api/backend";

class AddPlayerForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      auth0Players: [],
      playersName: [],
      isAuthenticated: false
    };

    this.state = this.initialState;

    this.addPlayerBtn = React.createRef();
    this.hiddenForm = React.createRef();
    this.confirmBtn = React.createRef();
    this.inputPlayer = React.createRef();
  }

  getPlayers = async () => {
    try {
      await backend
        .get("/api/89ball_season/playersdb", {
          params: {},
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        })
        .then(res => {
          this.setState({
            auth0Players: orderBy(res.data, ["username"], ["asc"]),
            playersName: orderBy(this.props.players, ["staffName"], ["asc"])
              .filter(player => player.staffName !== "admin")
              .map(player => player.staffName),
            isAuthenticated: true
          });
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

  handleClick = event => {
    if (this.hiddenForm.current.style.display === "none") {
      this.hiddenForm.current.style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      };
      this.addPlayerBtn.current.style.display = "none";
    } else {
      this.hiddenForm.current.style.display = "none";
      this.addPlayerBtn.current.style = {
        display: "flex"
      };
      if (event.target === this.confirmBtn.current) {
        var player = this.inputPlayer.current.value;
        this.props.addPlayer(player);
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuthenticated === false && auth0Client.isAuthenticated()) {
      this.getPlayers();
    }
  }

  render() {
    return (
      <div className="addPlayerForm">
        <button
          type="button"
          onClick={this.handleClick}
          ref={this.addPlayerBtn}
        >
          + Add New Player
        </button>
        <div
          className="hiddenForm"
          ref={this.hiddenForm}
          style={{ display: "none" }}
        >
          <h3>Add New Player</h3>
          <label>Select a player:</label>
          <select ref={this.inputPlayer}>
            {filter(
              this.state.auth0Players,
              p =>
                !this.state.playersName.includes(p.username) &&
                p.username !== "admin"
            ).map(player => {
              return (
                <option key={player.username} value={player.username}>
                  {player.username}
                </option>
              );
            })}
          </select>

          <div className="addPlayerFormButtons">
            <button type="button" onClick={this.handleClick}>
              Cancel
            </button>
            <button
              type="button"
              onClick={event => this.handleClick(event)}
              ref={this.confirmBtn}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPlayerForm;
