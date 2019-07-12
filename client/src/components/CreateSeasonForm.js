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

  isValid() {
    var regex = /^[A-Z]+$/; // matches 1 or more capital letters
    var regexSeasonNumber = /^[1-9]([0-9])*$/; // matches 1 number from 1 to 9 followed by 0 or more numbers from 0 to 9

    /* check if the season name text input matches the regular expression, otherwise, check if there are less than 2 players inputted */
    if (!regexSeasonNumber.test(this.state.seasonName)) {
      return { valid: false, message: "Season number can only be a number" };
    } else if (this.state.playersName.length < 2) {
      return { valid: false, message: "Season requires at least 2 people" };
    }

    /* check if the player text inputs match the regular expression */
    for (var i = 0; i < this.state.playersName.length; i++) {
      if (!regex.test(this.state.playersName[i])) {
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
      const newState = this.state.players.concat(this.preparePlayers());

      //SET STATE IS ASYNCHRONOUS
      this.setState({ players: newState }, () => {
        this.props.createSeason(this.state);
        //this.postCreateSeasonSlackMessage();
        document.getElementById("container").style.display = "none";
        this.setState(this.initialState);
      });
    }
  }

  preparePlayers() {
    let temp = [];
    this.state.playersName.map(
      playerName =>
        (temp = [
          ...temp,
          {
            type: this.props.type,
            seasonId: parseInt(this.state.seasonName),
            staffName: playerName
          }
        ])
    );
    return temp;
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
            onKeyPress={e => this.handleKeyDown(e)}
          />
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
                  {console.log("id: inputPlayer" + (index + 1))}
                  <div
                    id={"button" + (index + 1)}
                    className="delete-icon"
                    alt="remove player"
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
              //style={createSeasonBtnStyle}
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
