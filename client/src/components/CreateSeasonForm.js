import React, { Component } from "react";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };

    this.hasInvalidCells = false;
  }

  addPlayer() {
    this.setState({ players: [...this.state.players, ""] });
  }

  handleChange(e, index) {
    this.state.players[index] = e.target.value;
    this.setState({ players: this.state.players });
  }

  removePlayer(index) {
    this.state.players.splice(index, 1);

    this.setState({ players: this.state.players });
  }

  handleSubmit(e) {
    var regex = /^[a-zA-Z]+$/;
    /* check if the text inputs match the regular expression */
    for (var i = 0; i < this.state.players.length; i++) {
      if (!regex.test(this.state.players[i])) {
        this.hasInvalidCells = true;
      }
    }
    /* check if the season name text input is empty */
    if (document.getElementById("inputSeasonName").value === "") {
      this.hasInvalidCells = true;
    }
    /* alert the user that their input is not valid */
    if (this.hasInvalidCells) {
      alert("Not a valid input");
      this.hasInvalidCells = false;
    } else {
      /* refresh the page */
      window.location.reload();
    }

    console.log(this.state.players);
  }

  render() {
    return (
      <div className="createSeasonForm">
        <h2>Create a season</h2>
        <form>
          <label>Season name</label>
          {/* season name text input */}
          <input type="text" placeholder="Season name" id="inputSeasonName" />
          <div className="inputPlayers">
            {/* Map the players in the state to inputs */}
            {this.state.players.map((player, index) => {
              return (
                <div key={index}>
                  <label>Player {index + 1}</label>
                  {/* player name text input */}
                  <input
                    placeholder="Player name"
                    className="inputPlayerName"
                    onChange={e => this.handleChange(e, index)}
                    value={player}
                  />
                  {/* button for removing player */}
                  <button
                    type="button"
                    className="removeBtn"
                    onClick={() => this.removePlayer(index)}
                  >
                    - Remove
                  </button>
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
            {/* button for creating a season */}
            <button type="button" onClick={e => this.handleSubmit(e)}>
              Create season
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateSeasonForm;
