import React from "react";
import backend from "../../api/backend";

class ArrangeFixture extends React.Component {
  state = {
    type: "",
    players: [],
    activeSeason: 0,
    activePlayer: " ",
    activeOpponent: " ",
    unplayedFixtures: []
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
          <br />
          <label>Day:</label>
          <select>
            <option selected disabled value="day">
              Day
            </option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
          <br />
          <label>Time:</label>
          <select>
            <option selected disabled value="time">
              Time
            </option>
            <option value="11:00">11:00</option>
            <option value="11:15">11:15</option>
            <option value="11:30">11:30</option>
            <option value="11:45">11:45</option>
            <option value="12:00">12:00</option>
            <option value="12:15">12:15</option>
            <option value="12:30">12:30</option>
            <option value="12:45">12:45</option>
            <option value="13:00">13:00</option>
            <option value="13:15">13:15</option>
            <option value="13:30">13:30</option>
            <option value="13:45">13:45</option>
            <option value="14:00">14:00</option>
          </select>
          <br />
          <div id="arrangeFixtureBtn">
            <button type="button">Arrange</button>
          </div>
        </form>
      </div>
    );
  }
}

export default ArrangeFixture;
