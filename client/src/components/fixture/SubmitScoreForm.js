import React, { Component } from "react";
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

  /* posts a message to a slack channel with the submitted score */
  postScoreUpdateSlackMessage() {
    (async () => {
      await this.web.chat.postMessage({
        channel: this.channel,
        /* post a message saying 'emoji PLAYER1 X - X PLAYER2' */
        text:
          (this.props.type === 8 ? ":8ball:" : ":9ball:") +
          " RESULT:\n" +
          this.state.players.split(" ")[0] +
          "  " +
          this.state.score1 +
          "  -  " +
          this.state.score2 +
          "  " +
          this.state.players.split(" ")[1]
      });

      console.log("Score message posted!");
    })();
  }

  handleSubmit() {
    if (!this.isValid()) {
      alert("Not a valid input");
    } else {
      /* submit score */
      this.props.changeFixtureScore(this.prepareSubmitState());
      this.setState(this.initialState);
      this.postScoreUpdateSlackMessage();
    }
  }

  prepareSubmitState() {
    let submitableState = this.state;
    let arr = this.state.players.split(" ");
    submitableState.player1 = arr[0];
    submitableState.player2 = arr[1];
    return submitableState;
  }

  setScore1(score) {
    this.setState({ score1: score });
  }

  setScore2(score) {
    this.setState({ score2: score });
  }

  handleRadioClick() {
    if (this.refs.player1won.checked) {
      this.setScore1(2);
      this.setScore2(0);
    } else if (this.refs.player2won.checked) {
      this.setScore1(0);
      this.setScore2(2);
    } else {
      this.setScore1(1);
      this.setScore2(1);
    }
  }

  resultStyle() {
    if (this.state.players === "") {
      return {
        display: "none"
      };
    } else {
      return {
        display: "block"
      };
    }
  }

  render() {
    return (
      <div id="submitScoreForm">
        <h3>Submit Result</h3>
        <form>
          {/*<input
            type="number"
            min="0"
            placeholder="Score"
            id="score1"
            value={this.state.score1}
            onChange={e => this.setScore1(e)}
          />*/}
          <select
            id="selectFixture"
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
          {/*<input
            type="number"
            min="0"
            placeholder="Score"
            id="score2"
            value={this.state.score2}
            onChange={e => this.setScore2(e)}
          />*/}
          <br />
          <div id="result" className="selectWinner" style={this.resultStyle()}>
            <label>Who won?</label> <br />
            <input
              id="player1won"
              ref="player1won"
              type="radio"
              name="result"
              value="player1"
              onClick={this.handleRadioClick.bind(this)}
            />
            <label htmlFor="player1won">
              {this.state.players.split(" ")[0]}
            </label>
            <input
              id="draw"
              ref="draw"
              type="radio"
              name="result"
              value="draw"
              onClick={this.handleRadioClick.bind(this)}
            />
            <label htmlFor="draw">DRAW</label>
            <input
              id="player2won"
              ref="player2won"
              type="radio"
              name="result"
              value="player2"
              onClick={this.handleRadioClick.bind(this)}
            />
            <label htmlFor="player2won">
              {this.state.players.split(" ")[1]}
            </label>{" "}
            <br />
          </div>
          <button
            type="button"
            id="submitScoreBtn"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to submit this result?")
              )
                this.handleSubmit();
            }}
          >
            Submit Result
          </button>
        </form>
      </div>
    );
  }
}

export default SubmitScoreForm;
