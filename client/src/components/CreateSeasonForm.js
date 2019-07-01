import React, { Component } from "react";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };
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
    console.log(this.state.players);
  }

  render() {
    return (
      <div className="createSeasonForm">
        <h2>Create a season</h2>
        <form>
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
            <button type="submit" onClick={e => this.handleSubmit(e)}>
              Create season
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateSeasonForm;
