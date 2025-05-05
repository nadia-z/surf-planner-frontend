import React from "react";
import Group from "../group/group";
import "./slot.css";

const Slot = ({ slot, removeStudent, non_participating_guests}) => (
  <div className="slot-container">
    <h3>{slot.time}</h3>
    <div className="groups-container">
      {slot.groups.map((group, i) => (
        <Group
          key={i}
          group={group}
          non_participating_guests={non_participating_guests}
          removeStudent={removeStudent}
        />
      ))}
    </div>
  </div>
);


export default Slot;
