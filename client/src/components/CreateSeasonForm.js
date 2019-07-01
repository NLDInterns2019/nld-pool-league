import React, { Component } from "react";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };

    //var hasEmptyCells = false;
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
    /*var regex = /^[a-zA-Z]+$/;
    for (var i = 0; i < this.state.players.length; i++) {
      if (!regex.test(this.state.players[i])) {
        hasEmptyCells = true;
      }
    }
    if (hasEmptyCells) {
      alert("inputs cannot be empty");
    } else {
      location.reload();
    }*/

    console.log(this.state.players);
  }

  render() {
    return (
      <div className="createSeasonForm">
        <h2>Create a season</h2>
        <form>
          <label>Season name:</label>
          <input type="text" placeholder="Season name" />
          <div className="inputPlayers">
            {this.state.players.map((player, index) => {
              return (
                <div key={index}>
                  <label>Player {index + 1}</label>
                  <input
                    placeholder="Player name"
                    className="inputPlayerName"
                    onChange={e => this.handleChange(e, index)}
                    value={player}
                  />
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

            <button
              type="button"
              id="addPlayer"
              onClick={e => this.addPlayer(e)}
            >
              + Add player
            </button>
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
