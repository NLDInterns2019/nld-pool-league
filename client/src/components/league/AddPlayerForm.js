import React, { Component } from "react";

class AddPlayerForm extends Component {
  constructor(props) {
    super(props);

    this.addPlayerBtn = React.createRef();
    this.hiddenForm = React.createRef();
    this.confirmBtn = React.createRef();
    this.inputPlayer = React.createRef();
  }

  handleClick = event => {
    if (this.hiddenForm.current.style.display === "none") {
      this.hiddenForm.current.style = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      };
      this.addPlayerBtn.current.style.display = "none";
    } else {
      this.hiddenForm.current.style.display = "none";
      this.addPlayerBtn.current.style = {
        display: "flex"
      };
      if (event.target === this.confirmBtn.current) {
        var player = this.inputPlayer.current.value;
        this.props.addPlayer(player);
      }
    }
  };

  render() {
    return (
      <div class="addPlayerForm">
        <button
          type="button"
          onClick={this.handleClick}
          ref={this.addPlayerBtn}
        >
          + Add New Player
        </button>
        <div
          className="hiddenForm"
          ref={this.hiddenForm}
          style={{ display: "none" }}
        >
          <h3>Add New Player</h3>
          <label>Select player:</label>
          <select ref={this.inputPlayer}>
            <option>Player 1</option>
            <option>Player 2</option>
            <option>Player 3</option>
          </select>
          <div className="addPlayerFormButtons">
            <button type="button" onClick={this.handleClick}>
              Cancel
            </button>
            <button
              type="button"
              onClick={event => this.handleClick(event)}
              ref={this.confirmBtn}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPlayerForm;
