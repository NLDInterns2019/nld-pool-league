import React from "react";
import backend from "../api/backend";

class ViewYourFixtures extends React.Component {
  state = {
    seasons: [],
    players: [],
    activeSeason: "",
    activePlayer: "",
  };

  getSeasonsList = async () => {
    const response = await backend.get("/api/8ball_season");
    this.setState({ seasons: response.data });
  };

  getPlayers = async () => {
    const response = await backend.get(
      "/api/8ball_league/" + this.state.activeSeason
    );

    this.setState({ players: response.data });
  };

  componentDidMount() {
    this.getSeasonsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeSeason !== prevState.activeSeason) {
      this.getSeasonsList();
      this.getPlayers();
    }
  }

  viewFixtures = () => {
    this.props.viewFixtures(this.state.activeSeason, this.state.activePlayer);
  }

  render() {
    return (
      <div className="viewYourFixtures">
        <h3>View Your Fixtures</h3>
        <form>
          <label>Select a season:</label>
          <select
            value={this.state.activeSeason}
            onChange={e => this.setState({ activeSeason: e.target.value })}
          >
            <option disabled value="">
              Season
            </option>
            {this.state.seasons.map(season => {
              return <option key={season.seasonId} value={season.seasonId}>{season.seasonId}</option>;
            })}
          </select>
          <br />
          <label>Select your name:</label>
          <select
            value={this.state.activePlayer}
            onChange={e => this.setState({ activePlayer: e.target.value })}
          >
            <option value="" disabled>
              Name
            </option>
            {this.state.players.map(player => {
              return <option key={player.staffName} value={player.staffName}>{player.staffName}</option>;
            })}
          </select>
          <div className="viewBtn">
            <button type="button" onClick={this.viewFixtures}>View</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ViewYourFixtures;
