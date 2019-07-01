import React, { Component } from "react";

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    this.hasInvalidCells = false;
  }

  handleSubmit(e) {
    var regexName = /^[a-zA-Z]+$/;
    var regexScore = /^[0-2]$/;
    var score1 = parseInt(document.getElementById("score1").value, 10);
    var score2 = parseInt(document.getElementById("score2").value, 10);

    console.log("Scores sum: " + (score1 + score2));

    /* check the inputs match the regular expressions */
    if (
      !regexName.test(document.getElementById("player1").value) ||
      !regexName.test(document.getElementById("player2").value) ||
      !regexScore.test(document.getElementById("score1").value) ||
      !regexScore.test(document.getElementById("score2").value)
    ) {
      this.hasInvalidCells = true;
    }
    /* check the two scores entered add up to 2 */
    if (score1 + score2 !== 2) {
      this.hasInvalidCells = true;
    }
    if (this.hasInvalidCells) {
      alert("Not a valid input");
      this.hasInvalidCells = false;
    } else {
      /* submit score */
      alert("Submitted!");
    }
  }

  render() {
    return (
      <div className="submitScoreForm">
        <h2>Submit Score</h2>
        <form>
          {/*<label>Score:</label>*/}
          <input type="number" placeholder="Score" id="score1" />
          {/*<label>Name:</label>*/}
          <input type="text" placeholder="Player 1" id="player1" />
          {/*<label>Name:</label>*/}
          <input type="text" placeholder="Player 2" id="player2" />
          {/*<label>Score:</label>*/}
          <input type="number" placeholder="Score" id="score2" />
          <br />
          <button type="button" onClick={e => this.handleSubmit(e)}>
            Submit Score
          </button>
        </form>
      </div>
    );
  }
}

export default SubmitScoreForm;
