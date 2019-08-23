import React from "react";
import backend from "../../api/backend";
import { orderBy, some, filter } from "lodash";
import auth0Client from "../../Auth";
import Axios from "axios";
import moment from "moment";

class CreateBooking extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      type: "",
      players: [],
      activeSeason: 0,
      activePlayer: " ",
      activeOpponent: " ",
      unplayedFixtures: [],
      friendlyMatch: false,
      initialLoad: true
    };

    this.state = this.initialState;
  }

  signal = Axios.CancelToken.source();

  getAllPlayers = async () => {
    try {
      const response = await backend.get("/api/89ball_season/playersdb", {
        cancelToken: this.signal.token,
        params: {},
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      });
      this.setState({
        players: orderBy(
          filter(response.data, player => player.nickname !== "admin"),
          ["username"],
          ["asc"]
        )
      });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  getPlayers = async () => {
    try {
      const response = await backend.get(
        "/api/89ball_league/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type
          }
        }
      );
      this.setState({
        players: orderBy(response.data, ["staffName"], ["asc"])
      });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  getUnplayedFixtures = async () => {
    try {
      const unplayedFixtures = await backend.get(
        "/api/89ball_fixture/" + this.state.activeSeason,
        {
          cancelToken: this.signal.token,
          params: {
            type: this.state.type,
            staffName: this.state.activePlayer,
            hidePlayed: true
          }
        }
      );
      this.setState({ unplayedFixtures: unplayedFixtures.data });
    } catch (err) {
      //API CALL BEING CANCELED
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      (this.state.activeSeason !== prevState.activeSeason ||
        this.props.type !== prevProps.type ||
        this.state.activePlayer !== prevState.activePlayer ||
        this.state.friendlyMatch !== prevState.friendlyMatch) &&
      this.props.type !== undefined
    ) {
      await this.setState({ type: this.props.type });
      await this.setState({ activeSeason: this.props.activeSeason });
      if (this.state.activeSeason !== undefined) {
        if (this.state.friendlyMatch) {
          this.getAllPlayers();
        } else {
          this.getPlayers();
          this.getUnplayedFixtures();
          this.setState({ activeOpponent: " " });
        }
      }
    }

    if (this.state.initialLoad && this.state.players.length) {
      if (
        auth0Client.isAuthenticated() &&
        some(this.state.players, {
          staffName: auth0Client.getProfile().nickname
        })
      ) {
        this.setState({
          activePlayer: auth0Client.getProfile().nickname,
          initialLoad: false
        });
      }
    }
  };

  componentWillUnmount() {
    this.signal.cancel("");
  }

  playerDropDown = () => {
    return (
      <select
        value={this.state.activePlayer}
        onChange={e => this.setState({ activePlayer: e.target.value })}
      >
        <option value=" " disabled>
          Name
        </option>
        {this.state.friendlyMatch
          ? this.state.players.map(player => {
              return (
                <option key={player.username} value={player.username}>
                  {player.username}
                </option>
              );
            })
          : this.state.players.map(player => {
              return (
                <option key={player.staffName} value={player.staffName}>
                  {player.staffName}
                </option>
              );
            })}
      </select>
    );
  };

  opponentDropDown = () => {
    return (
      <select
        value={this.state.activeOpponent}
        onChange={e => this.setState({ activeOpponent: e.target.value })}
      >
        <option value=" " disabled>
          Name
        </option>
        {this.state.activePlayer !== " "
          ? this.state.friendlyMatch
            ? filter(
                this.state.players,
                player => player.username !== this.state.activePlayer
              ).map(player => {
                return (
                  <option key={player.username} value={player.username}>
                    {player.username}
                  </option>
                );
              })
            : this.state.unplayedFixtures.map(fixture => {
                if (fixture.player1 === this.state.activePlayer) {
                  return (
                    <option key={fixture.id} value={fixture.player2}>
                      {fixture.player2}
                    </option>
                  );
                } else {
                  return (
                    <option key={fixture.id} value={fixture.player1}>
                      {fixture.player1}
                    </option>
                  );
                }
              })
          : null}
      </select>
    );
  };

  makeBooking = () => {
    this.props.makeBooking(this.state.activePlayer, this.state.activeOpponent);
    this.setState(this.initialState);
  };

  isValidBooking = () => {
    if (this.state.activePlayer === " " || this.state.activeOpponent === " ") {
      return false;
    }
    return true;
  };

  render() {
    return (
      <div id="arrangeFixture">
        <h3>Arrange Fixture</h3>
        <p>
          {moment(this.props.start)
            .format("dddd DD MMM YYYY HH:mm")
            .toString()}
        </p>
        <form>
          <label>Select your name:</label>
          {this.playerDropDown()}
          <br />
          <label>Select your opponent:</label>
          {this.opponentDropDown()}
          <label htmlFor="hide" className="hide">
            Friendly/Billiard:
          </label>
          <input
            id="hide"
            className="hide"
            type="checkbox"
            name="hidePlayed"
            checked={this.state.friendlyMatch}
            onChange={e => {
              this.setState({ friendlyMatch: e.target.checked });
            }}
          />
          <div id="arrangeFixtureBtn">
            {this.isValidBooking() ? (
              <button type="button" onClick={this.makeBooking}>
                Arrange
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  }
}

export default CreateBooking;
