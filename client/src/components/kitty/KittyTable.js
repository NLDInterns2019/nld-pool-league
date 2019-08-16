import React from "react";
import moment from "moment";

const KittyTable = props => {
  const toBeDisplayed = props.kitty.map(k => {
    return (
      <tr key={k.id}>
        <td>{k.id}</td>
        <td className="kittyTableDate">{moment(k.date).format("DD-MM-YY")}</td>
        <td>
          {k.type === 8 ? (
            <div className="eight-ball-icon-20" alt="eight ball" />
          ) : k.type === 9 ? (
            <div className="nine-ball-icon-20" alt="nine ball" />
          ) : (
            "type error"
          )}
        </td>
        <td>{k.seasonId}</td>
        <td>{k.staffName}</td>
        <td className="kittyTableDesc">{k.description}</td>
        {k.value < 0 ? (
          <td style={{ color: "Red" }} align="center">
            £{k.value.toFixed(2)}
          </td>
        ) : (
          <td style={{ color: "Green" }} align="center">
            £{k.value.toFixed(2)}
          </td>
        )}
      </tr>
    );
  });

  if (props.kitty.length === 0) {
    return null;
  }
  return (
    <div>
      <div className="kittyTitle">
        <h3>Statement:</h3>

        <h3 id="balanceTracker">
          {props.kitty.length
            ? "Balance: £" + props.kitty[0].total.toFixed(2)
            : null}
        </h3>
      </div>

      <table cellSpacing="0" className="kittyTable">
        <thead>
          <tr>
            <th>#</th>
            <th className="kittyTableDate">Date</th>
            <th>Type</th>
            <th>Season</th>
            <th>Name</th>
            <th className="kittyTableDesc">Description</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{toBeDisplayed}</tbody>
      </table>
    </div>
  );
};

export default KittyTable;
