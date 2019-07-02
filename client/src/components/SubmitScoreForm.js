import React, { Component } from "react";

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    this.hasInvalidCells = false;
  }

  handleSubmit(e) {
    var regexScore = /^[0-2]$/; // matches 0, 1, or 2
    var score1 = parseInt(document.getElementById("score1").value, 10);
    var score2 = parseInt(document.getElementById("score2").value, 10);

    /* check the inputs match the regular expressions */
    if (!regexScore.test(score1) || !regexScore.test(score2)) {
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
          <label>Select a fixture:</label>
          <select>
            <option value="option1">A vs B</option>
            <option value="option2">Mal vs Winston</option>
            <option value="option3">A vs E</option>
          </select>
          <br />
          <input type="number" placeholder="Score" id="score1" />
          <label>vs</label>
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
