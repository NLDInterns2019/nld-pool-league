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

  getSeasonsList = async () => {
    try{
      const response = await backend.get("/api/89ball_season", {
        cancelToken: this.signal.token,
        params: {
          type: this.state.type
        }
      });
      this.setState({ seasons: response.data });
    }catch (err) {
      //API CALL BEING CANCELED
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

  seasonDropDown = () => {
    return (
      <div>
        <label>Season: </label>
        <select
          value={this.state.seasonId}
          onChange={e => this.setState({ seasonId: e.target.value })}
        >
          <option value="" disabled>
            Select Seasons
          </option>
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

  isValueValid() {
    const regex = /^(0)(.[0-9]+[1-9])?$|^(([1-9][0-9]*))(.[0-9]+)?$/;
    if (regex.test(this.state.value) && this.state.value !== 0) {
      return true;
    }
    return false;
  }

  isFormValid() {
    if (
      this.state.seasonId === "" ||
      this.state.description === "" ||
      this.state.value === 0
    ) {
      return false;
    }
    return true;
  }

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
            {this.state.transactionType === "CREDIT" ? (
              <label>Value: £</label>
            ) : (
              <label>Value: <span style={{color:"red"}}>£-</span></label>
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
            {this.isValueValid() ? null : (
              <label style={{ color: "red" }}>Invalid Value</label>
            )}
          </div>
        </form>
        <br />
        {(this.isFormValid() && this.isValueValid()) ? (
          <button type="button" onClick={this.submitTransaction}>
            Submit
          </button>
        ) : null}
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
