import React, { Component } from "react";
import DeleteButton from "../delete-button.svg";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      players: [],
      seasonName: ""
    };

    this.state = this.initialState;
    this.createSeason = this.createSeason.bind(this);
  }

  addPlayer() {
    this.setState({ players: [...this.state.players, ""] });
  }

  handleChange(e, indexToChange) {
    this.setState({
      players: this.state.players.map((player, index) => {
        if (index === indexToChange) {
          return e.target.value.toUpperCase();
        }
        return player;
      })
    });
  }

  removePlayer(index) {
    this.state.players.splice(index, 1);
    this.setState({ players: this.state.players });
  }

  setSeasonName(e) {
    this.setState({ seasonName: e.target.value });
  }

  isValid() {
    var regex = /^[A-Z]+$/; // matches 1 or more capital letters
    var regexSeasonNumber = /^[1-9]([0-9])*$/; // matches 1 number from 1 to 9 followed by 0 or more numbers from 0 to 9

    /* check if the season name text input matches the regular expression, otherwise, check if there are less than 2 players inputted */
    if (!regexSeasonNumber.test(this.state.seasonName)) {
      return { valid: false, message: "Season number can only be a number" };
    } else if (this.state.players.length < 2) {
      return { valid: false, message: "Season requires at least 2 people" };
    }

    /* check if the player text inputs match the regular expression */
    for (var i = 0; i < this.state.players.length; i++) {
      if (!regex.test(this.state.players[i])) {
        return {
          valid: false,
          message: "Player names can only include capital letters"
        };
      }
    }
    return { valid: true };
  }

  createSeason() {
    /* alert the user that their input is not valid, otherwise, create the season */
    const valid = this.isValid();
    if (!valid.valid) {
      window.alert(valid.message);
    } else {
      this.props.createSeason(this.state);
      document.getElementById("container").style.display = "none";
      this.setState(this.initialState);
    }
  }

  render() {
    return (
      <div className="createSeasonForm">
        <h3>Create a Season</h3>
        <form>
          <label>Season number:</label>
          <input
            type="text"
            placeholder="Season number"
            value={this.state.seasonName}
            id="inputSeasonNo"
            onChange={e => this.setSeasonName(e)}
          />
          <div className="inputPlayers">
            {/* map the players in the state to inputs */}
            {this.state.players.map((player, index) => {
              return (
                <div key={index} className="form-row">
                  <label>Player {index + 1}:</label>

                  {/* player name text input */}
                  <input
                    placeholder="Player name"
                    className="inputPlayerName"
                    id={"inputPlayer" + (index + 1)}
                    onChange={e => this.handleChange(e, index)}
                    value={player}
                  />

                  {/* button for removing player */}
                  {/*<button
                    type="button"
                    className="removeBtn"
                    id={"button" + (index + 1)}
                    onClick={() => this.removePlayer(index)}
                  >
                    - Remove
                  </button>*/}
                  <img
                    src={DeleteButton}
                    id={"button" + (index + 1)}
                    className="delete-icon"
                    onClick={() => this.removePlayer(index)}
                  />
                </div>
              );
            })}

            {/* button for adding a player */}
            <button
              type="button"
              id="addPlayer"
              onClick={e => this.addPlayer(e)}
            >
              + Add player
            </button>

            {/* button for creating new season */}
            <button
              type="button"
              id="createSeasonBtn"
              onClick={this.createSeason}
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
