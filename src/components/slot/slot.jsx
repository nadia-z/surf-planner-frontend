import React from "react";
import Group from "../group/group";
import "./slot.css";

const Slot = ({ slot }) => (
  <div className="slot-container">
    <h3>{slot.time}</h3>
    <div className="groups-container">
      {slot.groups.map((group, i) => (
        <Group key={i} group={group} />
      ))}
    </div>
  </div>
);


export default Slot;
