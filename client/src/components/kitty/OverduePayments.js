import React from "react";

const itemsToDisplay = props => {
  const itemsToDisplay = props.unpaid.map(player => {
    return (
      <tr key={player.staffName + player.type + player.seasonId}>
        <td>{player.staffName}</td>
        <td>
          {player.type === 8 ? (
            <div className="eight-ball-icon-20" alt="eight ball" />
          ) : player.type === 9 ? (
            <div className="nine-ball-icon-20" alt="nine ball" />
          ) : (
            "type error"
          )}
        </td>
        <td>{player.seasonId}</td>
        <td
          className="overduePaymentsPay"
          onClick={() =>
            props.payJoiningFee(player.staffName, player.type, player.seasonId)
          }
        >
          Pay
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
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Season</th>
          </tr>
        </thead>
        <tbody>{itemsToDisplay(props)}</tbody>
      </table>
    </div>
  );
};

export default OverduePayments;
