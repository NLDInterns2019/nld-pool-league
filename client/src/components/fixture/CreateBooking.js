import React from "react";
import backend from "../../api/backend";
import { orderBy, some } from "lodash";
import auth0Client from "../../Auth";
import Axios from "axios";
import moment from "moment"

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
      initialLoad: true
    };

    this.state = this.initialState;
  }

  signal = Axios.CancelToken.source();

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
        this.state.activePlayer !== prevState.activePlayer) &&
      this.props.type !== undefined
    ) {
      await this.setState({ type: this.props.type });
      await this.setState({ activeSeason: this.props.activeSeason });
      if (this.state.activeSeason !== undefined) {
        this.getPlayers();
        this.getUnplayedFixtures();
        this.setState({activeOpponent: " "})
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
        {this.state.players.map(player => {
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
          ? this.state.unplayedFixtures.map(fixture => {
              if (fixture.player1 === this.state.activePlayer) {
                return (
                  <option key={fixture.id} value={fixture.player2}>
                    {fixture.player2}
                  </option>
                );
              } else {
                return (
                  <option key={fixture.id} value={fixture.player1s}>
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
        <p>{moment(this.props.start).format("dddd DD MMM YYYY HH:mm").toString()}</p>
        <form>
          <label>Select your name:</label>
          {this.playerDropDown()}
          <br />
          <label>Select your opponent:</label>
          {this.opponentDropDown()}
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
