import React, { Component } from "react";

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    var hasInvalidCells = false;
  }

  handleSubmit(e) {
    var regexName = /^[a-zA-Z]+$/;
    var regexScore = /^[0-2]$/;
  }
  render() {
    return (
      <div className="submitScoreForm">
        <h2>Submit Score</h2>
        <form>
          <label>Name:</label>
          <input type="text" placeholder="Player 1" id="player1" />
          <label>Score:</label>
          <input type="number" placeholder="Score" id="score1" />
          <br />
          <label>Name:</label>
          <input type="text" placeholder="Player 2" id="player2" />
          <label>Score:</label>
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
