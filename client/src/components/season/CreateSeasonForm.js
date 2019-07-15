import React, { Component } from "react";
const { WebClient } = require("@slack/web-api");

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      playersName: ["", ""],
      seasonName: "",
      players: []
    };

    this.state = this.initialState;
    this.createSeason = this.createSeason.bind(this);

    /* slack token */
    const token =
      "xoxp-685145909105-693344350935-691496978112-a5c73f958a992b52284cfcc86433895e";
    /* test channel */
    this.channel = "CLB0QN8JY";
    this.web = new WebClient(token);
  }

  addPlayer() {
    this.setState({ playersName: [...this.state.playersName, ""] });
  }

  handleChange(e, indexToChange) {
    this.setState({
      playersName: this.state.playersName.map((player, index) => {
        if (index === indexToChange) {
          return e.target.value.toUpperCase();
        }
        return player;
      })
    });
  }

  postCreateSeasonSlackMessage() {
    (async () => {
      await this.web.chat.postMessage({
        channel: this.channel,
        text:
          "New " +
          (this.props.type === 8 ? ":8ball:" : ":9ball:") +
          " season called 'Season " +
          this.state.seasonName +
          "' created"
      });

      console.log("Season message posted!");
    })();
  }

  handleKeyDown(e, index) {
    if (e.key === "Enter") {
      console.log("enter pressed");
      this.addPlayer();
    } else if (e.key === "ArrowUp" && index > 1) {
      console.log("up arrow pressed");
      document.getElementById("inputPlayer" + (index - 1)).focus();
    } else if (e.key === "ArrowDown" && index < this.state.playersName.length) {
      console.log("down arrow pressed");
      document.getElementById("inputPlayer" + (index + 1)).focus();
    }
  }

  removePlayer(index) {
    this.state.playersName.splice(index, 1);
    this.setState({ playersName: this.state.playersName });
  }

  setSeasonName(e) {
    this.setState({ seasonName: e.target.value });
  }

  isValidPlayersNumber() {
    /* check if the season name text input matches the regular expression, otherwise, check if there are less than 2 players inputted */
    if (this.state.playersName.length < 2) {
      return false;
    }

    return true;
  }

  isValidPlayersName() {
    var regex = /^[A-Z]+$/; // matches 1 or more capital letters
    /* check if the player text inputs match the regular expression */
    for (var i = 0; i < this.state.playersName.length; i++) {
      if (!regex.test(this.state.playersName[i])) {
        return false;
      }
    }
    return true;
  }

  createSeason() {
    const newState = this.state.players.concat(this.preparePlayers());

    //SET STATE IS ASYNCHRONOUS
    this.setState({ players: newState }, () => {
      this.props.createSeason(this.state);
      document.getElementById("container").style.display = "none";
      this.setState(this.initialState);
    });
  }

  preparePlayers() {
    let temp = [];
    this.state.playersName.map(
      playerName =>
        (temp = [
          ...temp,
          {
            type: parseInt(this.props.type),
            seasonId: parseInt(this.state.seasonName),
            staffName: playerName
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

  /* displays button if inputs are valid, otherwise, hides it */
  createSeasonBtnStyle() {
    if (
      this.isValidSeason() &&
      this.isValidPlayersName() &&
      this.isValidPlayersNumber()
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
            onChange={e => this.setSeasonName(e)}
            onKeyPress={e => this.handleKeyDown(e)}
          />
          {this.isValidSeason() ? null : (
            <div className="error">Enter a valid season number!</div>
          )}
          <div className="inputPlayers">
            {/* map the players in the state to inputs */}
            {this.state.playersName.map((player, index) => {
              return (
                <div key={index} className="form-row">
                  {/* player name text input */}
                  <input
                    autoFocus
                    placeholder={"Player " + (index + 1)}
                    className="inputPlayerName"
                    id={"inputPlayer" + (index + 1)}
                    onChange={e => this.handleChange(e, index)}
                    value={player}
                    onKeyDown={e => this.handleKeyDown(e, index + 1)}
                  />
                  <div
                    id={"button" + (index + 1)}
                    className="delete-icon"
                    alt="remove player"
                    onClick={() => this.removePlayer(index)}
                  />
                </div>
              );
            })}
            {this.isValidPlayersNumber() ? null : (
              <div className="error">Not enough players</div>
            )}
            {this.isValidPlayersName() ? null : (
              <div className="error">Invalid Player(s) name</div>
            )}

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
