import React from "react";

/* gets all the unpaid seasons and displays them in a table */
const itemsToDisplay = props => {
  const itemsToDisplay = props.unpaid.map(player => {
    return (
      <tr key={player.staffName + player.type + player.seasonId}>
        <td>{player.staffName}</td>
        <td>
          {/* if type is 8-ball, show an 8-ball icon */}
          {player.type === 8 ? (
            <div className="eight-ball-icon-20 icon-20" alt="eight ball" />
          ) : /* if the type is 9-ball, show a 9-ball icon */
          player.type === 9 ? (
            <div className="nine-ball-icon-20 icon-20" alt="nine ball" />
          ) : (
            /* otherwise, show an error */
            "type error"
          )}
        </td>
        <td>{player.seasonId}</td>
        <td className="overduePaymentsPay">
          <div
            className="pay-button-container"
            onClick={() =>
              /* run payJoiningFee function in parent class */
              props.payJoiningFee(
                player.staffName,
                player.type,
                player.seasonId
              )
            }
          >
            <div className="money-cash-icon-grey icon-32" alt="cash" />
            <p>Pay</p>
          </div>
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
        <div className="calendar-icon icon-40" alt="calendar" />
        <h3>Overdue Payments</h3>
        <div className="calendar-icon icon-40" alt="calendar" />
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
