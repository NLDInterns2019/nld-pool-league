import React from "react";
import moment from "moment";

const KittyTable = props => {
  const toBeDisplayed = props.kitty.map(k => {
    return (
      <tr key={k.id}>
        <td align="center">{k.id}</td>
        <td align="center">{moment(k.date).format("DD-MMM-YYYY")}</td>
        <td align="center">{k.type}</td>
        <td align="center">{k.seasonId}</td>
        <td>{k.staffName}</td>
        <td>{k.description}</td>
        {k.value < 0 ? (
          <td style={{ color: "Red" }} align="center">
            {k.value}
          </td>
        ) : (
          <td style={{ color: "Green" }} align="center">
            +{k.value}
          </td>
        )}
        <td align="center">{k.total}</td>
      </tr>
    );
  });

  if (props.kitty.length === 0) {
    return null;
  }
  return (
    <div>
      <h3>Kitty</h3>
      <table cellSpacing="0">
        <thead>
          <tr>
            <th>No</th>
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
