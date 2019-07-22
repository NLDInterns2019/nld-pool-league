import React from "react";
import backend from "../../api/backend";

class CreateBooking extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      type: "",
      players: [],
      activeSeason: 0,
      activePlayer: " ",
      activeOpponent: " ",
      unplayedFixtures: []
    };

    this.state = this.initialState;
  }

  getPlayers = async () => {
    const response = await backend.get(
      "/api/89ball_league/" + this.state.activeSeason +"/asc",
      {
        params: {
          type: this.state.type
        }
      }
    );
    this.setState({ players: response.data });
  };

  getUnplayedFixtures = async () => {
    const unplayedFixtures = await backend.get(
      "/api/89ball_fixture/" + this.state.activeSeason,
      {
        params: {
          type: this.state.type,
          staffName: this.state.activePlayer,
          hidePlayed: true
        }
      }
    );

    this.setState({ unplayedFixtures: unplayedFixtures.data });
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
      }
    }
  };

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
