import React from "react";
import backend from "../../api/backend";
import axios from 'axios'

class ViewYourFixtures extends React.Component {
  state = {
    type: "",
    players: [],
    activeSeason: "",
    activePlayer: " ",
    hidePlayed: true
  };

  signal = axios.CancelToken.source();

  getPlayers = async () => {
    try{
      const response = await backend.get(
        "/api/89ball_league/" + this.state.activeSeason + "/asc",
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type
          }
        }
      );
      this.setState({ players: response.data });
    }
    catch(err) {
      //API BEING CALLED
    }    
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
    if (
      this.state.activePlayer !== prevState.activePlayer ||
      this.state.hidePlayed !== prevState.hidePlayed
    ) {
      this.props.applyFilter(this.state.activePlayer, this.state.hidePlayed);
    }
  };

  componentWillUnmount() {
    this.signal.cancel("")
  }

  clear = async () => {
    await this.setState({ activePlayer: " ", hidePlayed: true });
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
            Show played fixtures
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
