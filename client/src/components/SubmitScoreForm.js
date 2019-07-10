import React, { Component } from "react";

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      score1: "",
      player1: "",
      score2: "",
      player2: ""
    };

    this.state = this.initialState;
  }

  isValid() {
    var regexScore = /^[0-2]$/; // matches 0, 1, or 2
    var regexPlayer = /^[A-Z]+$/;
    var score1 = parseInt(this.state.score1);
    var score2 = parseInt(this.state.score2);
    var player1 = this.state.player1;
    var player2 = this.state.player2;

    /* check the inputs match the regular expressions */
    if (!regexScore.test(score1) || !regexScore.test(score2)) {
      return false;
    }
    /* check the two scores entered add up to 2 */
    if (score1 + score2 !== 2) {
      return false;
    }
    if (!regexPlayer.test(player1) || !regexPlayer.test(player2)) {
      return false;
    }

    return true;
  }

  handleSubmit() {
    if (!this.isValid()) {
      alert("Not a valid input");
    } else {
      /* submit score */
      this.props.changeFixtureScore(this.state);
      this.setState(this.initialState);
    }
  }

  setScore1(e) {
    this.setState({ score1: e.target.value });
  }

  setScore2(e) {
    this.setState({ score2: e.target.value });
  }

  setPlayer1(e) {
    this.setState({ player1: e.target.value.toUpperCase() });
  }

  setPlayer2(e) {
    this.setState({ player2: e.target.value.toUpperCase() });
  }

  render() {
    return (
      <div className="submitScoreForm">
        <h3>Submit Score</h3>
        <form>
          <input
            type="number"
            placeholder="Score"
            id="score1"
            value={this.state.score1}
            onChange={e => this.setScore1(e)}
          />
          <input
            type="text"
            placeholder="Player 1"
            id="player1"
            value={this.state.player1}
            onChange={e => this.setPlayer1(e)}
          />
          <input
            type="text"
            placeholder="Player 2"
            id="player2"
            value={this.state.player2}
            onChange={e => this.setPlayer2(e)}
          />
          <input
            type="number"
            placeholder="Score"
            id="score2"
            value={this.state.score2}
            onChange={e => this.setScore2(e)}
          />
          <br />
          <button
            type="button"
            id="submitScoreBtn"
            onClick={() => {
              if (window.confirm("Are you sure you want to submit this score?"))
                this.handleSubmit();
            }}
          >
            Submit Score
          </button>
        </form>
      </div>
    );
  }
}

export default SubmitScoreForm;
