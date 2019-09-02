import React from "react";
import backend from "../../api/backend";

import Axios from "axios";

class TransactionForm extends React.Component {
  state = {
    transactionType: "CREDIT",
    seasons: [],
    type: "8",
    seasonId: "",
    staffName: " ",
    description: "",
    value: 0
  };

  signal = Axios.CancelToken.source();

  /* gets all seasons of a specific type */
  getSeasonsList = async () => {
    try {
      const response = await backend.get("/api/89ball_season", {
        cancelToken: this.signal.token,
        params: {
          type: this.state.type
        }
      });
      this.setState({ seasons: response.data });
    } catch (err) {
      //API CALL BEING CANCELLED
    }
  };

  componentDidMount() {
    this.getSeasonsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.type !== prevState.type) {
      this.getSeasonsList();
    }
  }

  componentWillUnmount() {
    this.signal.cancel("");
  }

  /* function for displaying the credit and debit radio buttons */
  creditDebitRadio = () => {
    return (
      <div>
        <label className="radioContainer">
          <input
            type="radio"
            value="CREDIT"
            checked={this.state.transactionType === "CREDIT"}
            onChange={e => this.setState({ transactionType: e.target.value })}
          />
          Credit
        </label>
        <label className="radioContainer">
          <input
            type="radio"
            value="DEBIT"
            checked={this.state.transactionType === "DEBIT"}
            onChange={e => this.setState({ transactionType: e.target.value })}
          />
          Debit
        </label>
      </div>
    );
  };

  /* function for displaying thr game type radio buttons */
  typeRadio = () => {
    return (
      <div>
        <label>Type:</label>
        <label className="radioContainer">
          <input
            type="radio"
            value="8"
            checked={this.state.type === "8"}
            onChange={e => this.setState({ type: e.target.value })}
          />
          8 ball
        </label>
        <label className="radioContainer">
          <input
            type="radio"
            value="9"
            checked={this.state.type === "9"}
            onChange={e => this.setState({ type: e.target.value })}
          />
          9 ball
        </label>
      </div>
    );
  };

  /* function for displaying the season drop-down list */
  seasonDropDown = () => {
    return (
      <div>
        <label>Season: </label>
        <select
          value={this.state.seasonId}
          onChange={e => this.setState({ seasonId: e.target.value })}
        >
          <option value="" disabled>
            Select Season
          </option>
          {/* displays each season in the drop-down */}
          {this.state.seasons.map(season => {
            return (
              <option key={season.seasonId} value={season.seasonId}>
                {season.seasonId}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  handleValueChange = e => {
    const regex = /^(-?)$|^(-?)\d+(\.)*(\d+)*$/;
    if (regex.test(e.target.value)) {
      this.setState({ value: e.target.value });
    }
  };

  /* checks if the value entered is valid */
  isValueValid() {
    const regex = /^(0|[1-9][0-9]*)(\.[0-9]{2})?$/;
    if (
      regex.test(this.state.value) &&
      this.state.value !== 0 &&
      this.state.value !== "0.00"
    ) {
      return true;
    }
    return false;
  }

  /* checks the user has inputted values into the form */
  isFormValid() {
    if (
      this.state.seasonId === "" ||
      this.state.description === "" ||
      this.state.value === 0 ||
      this.state.value === "0.00"
    ) {
      return false;
    }
    return true;
  }

  /* runs the submitTransaction function in parent class */
  submitTransaction = () => {
    this.props.submitTransaction(this.state);
    this.setState({ seasonId: "", description: "", value: 0 });
  };

  render() {
    return (
      <div className="kittyTransactionContainer">
        <h3>Transaction</h3>
        <form>
          {this.creditDebitRadio()}
          {this.typeRadio()}
          {this.seasonDropDown()}
          <div>
            <label>Description: </label>
            <input
              type="text"
              size="15"
              placeholder="Enter description"
              value={this.state.description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </div>
          <div>
            {/* if the transaction is credit, display normally, if it is debit, display label as red */}
            {this.state.transactionType === "CREDIT" ? (
              <label>Value: £</label>
            ) : (
              <label>
                Value: <span style={{ color: "red" }}>-£</span>
              </label>
            )}
            <input
              style={{ textAlign: "right" }}
              type="text"
              size="3"
              placeholder="Value"
              value={this.state.value}
              onChange={this.handleValueChange}
            />
            <br />
            {/* if the user has entered invalid values, display a message in red */}
            {this.isValueValid() ? null : (
              <label style={{ color: "red" }}>Invalid Value</label>
            )}
          </div>
        </form>
        <br />
        {/* if the form is valid, display the submit button */}
        {this.isFormValid() && this.isValueValid() ? (
          <button type="button" onClick={this.submitTransaction}>
            Submit
          </button>
        ) : null}
        <button type="button" onClick={this.props.closeForm}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() =>
            this.setState({ seasonId: "", description: "", value: 0 })
          }
        >
          Clear
        </button>
      </div>
    );
  }
}

export default TransactionForm;
