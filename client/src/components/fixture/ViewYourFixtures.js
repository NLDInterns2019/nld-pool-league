import React from "react";
import axios from "axios";
import auth0Client from "../../Auth";
import { some, orderBy } from "lodash";

class ViewYourFixtures extends React.Component {
  state = {
    type: "",
    players: [],
    activeSeason: "",
    activePlayer: " ",
    hidePlayed: true,
    initialLoad: true
  };

  signal = axios.CancelToken.source();

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      (this.props.players !== prevProps.players ||
        this.state.activeSeason !== prevState.activeSeason ||
        this.props.type !== prevProps.type) &&
      this.props.type !== undefined
    ) {
      await this.setState({
        players: orderBy(this.props.players, ["staffName"], ["asc"])
      });
      await this.setState({ type: this.props.type });
      await this.setState({ activeSeason: this.props.activeSeason });
    }

    if (
      this.state.initialLoad &&
      this.state.activeSeason !== undefined &&
      this.state.players.length
    ) {
      if (
        auth0Client.isAuthenticated() &&
        some(this.state.players, { staffName: auth0Client.getProfile().nickname })
      ) {
        this.setState({
          activePlayer: auth0Client.getProfile().nickname,
          initialLoad: false
        });
      }
    }
    //Handle deletion
    if (
      this.state.activePlayer !== " " &&
      !some(this.state.players, { staffName: this.state.activePlayer })
    ) {
      this.setState({ activePlayer: " " });
    }

    if (
      this.state.activePlayer !== prevState.activePlayer ||
      this.state.hidePlayed !== prevState.hidePlayed
    ) {
      this.props.applyFilter(this.state.activePlayer, this.state.hidePlayed);
    }
  };

  componentWillUnmount() {
    this.signal.cancel("");
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
