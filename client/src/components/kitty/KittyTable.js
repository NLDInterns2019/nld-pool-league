import React from "react";
import moment from "moment";

const KittyTable = props => {
  const toBeDisplayed = props.kitty.map(k => {
    return (
      <tr key={k.id}>
        <td>{k.id}</td>
        <td>{moment(k.date).format("DD-MMM-YYYY")}</td>
        <td>
          {k.type === "8" ? (
            <div className="eight-ball-icon-20" alt="eight ball" />
          ) : k.type === "9" ? (
            <div className="nine-ball-icon-20" alt="nine ball" />
          ) : (
            "type error"
          )}
        </td>
        <td>{k.seasonId}</td>
        <td>{k.staffName}</td>
        <td>{k.description}</td>
        {k.value < 0 ? (
          <td style={{ color: "Red" }} align="center">
            {k.value}
          </td>
        ) : (
          <td style={{ color: "Green" }} align="center">
            +£{k.value}
          </td>
        )}
        <td id="balance">£{k.total}</td>
      </tr>
    );
  });

  if (props.kitty.length === 0) {
    return null;
  }
  return (
    <div>
      <h3>Kitty</h3>
      <table cellSpacing="0" className="kittyTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Type</th>
            <th>Season</th>
            <th>Name</th>
            <th>Description</th>
            <th>Value</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{toBeDisplayed}</tbody>
      </table>
    </div>
  );
};

export default KittyTable;
