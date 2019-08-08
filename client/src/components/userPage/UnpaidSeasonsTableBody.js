import React from "react";

const UnpaidSeasonsTableBody = props => {
  return props.unpaid.map(season => (
    <tr key={season.type + season.seasonId}>
      <td id="unpaid-type">
        {season.type === 8 ? (
          <div className="eight-ball-icon-20" alt="eight ball" />
        ) : season.type === 9 ? (
          <div className="nine-ball-icon-20" alt="nine ball" />
        ) : (
          "TYPE ERROR"
        )}
      </td>
      <td id="unpaid-name">{"Season " + season.seasonId}</td>
      <td id="unpaid-amount">£2.00</td>
      {/* <td id="unpaid-pay">Pay</td> */}
    </tr>
  ));
};

export default UnpaidSeasonsTableBody;
