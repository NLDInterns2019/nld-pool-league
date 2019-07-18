import React from "react";
import backend from "../../api/backend";

class ViewYourFixtures extends React.Component {
  state = {
    type: "",
    players: [],
    activeSeason: "",
    activePlayer: " ",
    hidePlayed: true
  };

  getPlayers = async () => {
    const response = await backend.get(
      "/api/89ball_league/" + this.state.activeSeason,
      {
        params: {
          type: this.state.type
        }
      }
    );
    this.setState({ players: response.data });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      (this.state.activeSeason !== prevState.activeSeason ||
        this.props.type !== prevProps.type) &&
      this.props.type !== undefined
    ) {
      await this.setState({ type: this.props.type });
      await this.setState({ activeSeason: this.props.activeSeason });
      if (this.state.activeSeason !== undefined) this.getPlayers();
    }
  };

  viewFixtures = () => {
    this.props.applyFilter(this.state.activePlayer, this.state.hidePlayed);
  };

  clear = async () => {
    await this.setState({ activePlayer: " ", hidePlayed: true });
    this.viewFixtures();
  };

  render() {
    return (
      <div className="viewYourFixtures">
        <h3>View Fixtures</h3>
        <form>
          <label>Select your name:</label>
          <select
            value={this.state.activePlayer}
            onChange={e => this.setState({ activePlayer: e.target.value })}
          >
            <option value=" ">ALL</option>
            {this.state.players.map(player => {
              return (
                <option key={player.staffName} value={player.staffName}>
                  {player.staffName}
                </option>
              );
            })}
          </select>
          <br />
          <label htmlFor="hide" className="hide">
            Show Played Fixtures
          </label>
          <input
            id="hide"
            className="hide"
            type="checkbox"
            name="hidePlayed"
            checked={!this.state.hidePlayed}
            onChange={e => {
              this.setState({ hidePlayed: !e.target.checked });
            }}
          />
          <div id="viewFixtureBtns">
            <button type="button" onClick={this.viewFixtures}>
              View
            </button>
            <button type="button" onClick={this.clear}>
              Clear
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ViewYourFixtures;
