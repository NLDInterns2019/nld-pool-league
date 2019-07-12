import React, { Component } from "react";
import FixtureTable from "./FixtureTable";
const { WebClient } = require("@slack/web-api");

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      players: "",
      score1: "",
      score2: ""
    };

    this.state = this.initialState;

    /* slack token */
    const token =
      "xoxp-685145909105-693344350935-691496978112-a5c73f958a992b52284cfcc86433895e";
    /* test channel */
    this.channel = "CLB0QN8JY";
    this.web = new WebClient(token);
  }

  isValid() {
    var regexScore = /^[0-2]$/; // matches 0, 1, or 2
    var score1 = parseInt(this.state.score1);
    var score2 = parseInt(this.state.score2);

    /* check the inputs match the regular expressions */
    if (!regexScore.test(score1) || !regexScore.test(score2)) {
      return false;
    }
    /* check the two scores entered add up to 2 */
    if (score1 + score2 !== 2) {
      return false;
    }

    return true;
  }

  postSlackMessage() {
    (async () => {
      // Use the `chat.postMessage` method to send a message from this app
      await this.web.chat.postMessage({
        channel: this.channel,
        /* post a message saying 'emoji PLAYER1 X - X PLAYER2' */
        text:
          (this.props.type === 8 ? ":8ball:" : ":9ball:") +
          "  " +
          this.state.players.split(" ")[0] +
          "  " +
          this.state.score1 +
          "  -  " +
          this.state.score2 +
          "  " +
          this.state.players.split(" ")[1]
      });

      console.log("Message posted!");
    })();
  }

  handleSubmit() {
    if (!this.isValid()) {
      alert("Not a valid input");
    } else {
      /* submit score */
      this.props.changeFixtureScore(this.prepareSubmitState());
      this.setState(this.initialState);
      this.postSlackMessage();
    }
  }

  prepareSubmitState() {
    let submitableState = this.state;
    let arr = this.state.players.split(" ");
    submitableState.player1 = arr[0];
    submitableState.player2 = arr[1];
    return submitableState;
  }

  setScore1(e) {
    this.setState({ score1: e.target.value });
  }

  setScore2(e) {
    this.setState({ score2: e.target.value });
  }

  render() {
    return (
      <div className="submitScoreForm">
        <h3>Submit Score</h3>
        <form>
          <input
            type="number"
            min="0"
            placeholder="Score"
            id="score1"
            value={this.state.score1}
            onChange={e => this.setScore1(e)}
          />
          <select
            value={this.state.players}
            onChange={e => this.setState({ players: e.target.value })}
          >
            <option disabled value={""}>
              PLAYER1 &nbsp;&nbsp;VS&nbsp;&nbsp; PLAYER 2
            </option>
            {this.props.unplayedFixtures.map(fixture => {
              let player1 = fixture.player1;
              let player2 = fixture.player2;
              return (
                <option
                  key={fixture.seasonID + fixture.player1 + fixture.player2}
                  value={player1 + " " + player2}
                >
                  {player1} &nbsp;&nbsp;VS&nbsp;&nbsp; {player2}
                </option>
              );
            })}
          </select>

          <input
            type="number"
            min="0"
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
