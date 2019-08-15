import React from "react";

const itemsToDisplay = props => {
  const itemsToDisplay = props.unpaid.map(player => {
    return (
      <tr key={player.staffName + player.seasonId}>
        <td>{player.staffName}</td>
        <td>{player.type}</td>
        <td>{player.seasonId}</td>
        <td id="submit" style={{ width: "120px" }}>
          Submit
        </td>
      </tr>
    );
  });
  return itemsToDisplay;
};

const OverduePayments = props => {
  return (
    <div className="overduePaymentsContainer">
      <div className="overduePaymentsTitle">
        <div className="calendar-icon" alt="calendar" />
        <h3>Overdue Payments</h3>
        <div className="calendar-icon" alt="calendar" />
      </div>

      <table cellSpacing="0" className="overduePaymentsTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Season</th>
            <th />
          </tr>
        </thead>
        <tbody>{itemsToDisplay(props)}</tbody>
      </table>
    </div>
  );
};

export default OverduePayments;
