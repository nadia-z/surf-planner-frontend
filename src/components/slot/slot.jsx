import React from "react";
import Group from "../group/group";
import "./slot.css";

const Slot = ({ slot, slotIndex, removeStudent, non_participating_guests, addStudentToGroup, highlightBookingNumber, setHighlightBookingNumber}) => (
  <div className="slot-container">
    <h3>{slot.time}</h3>
    <div className="groups-container">
      {slot.groups.map((group, groupIndex) => (
        <Group
          key={groupIndex}
          group={group}
          non_participating_guests={non_participating_guests}
          removeStudent={removeStudent}
          addStudentToGroup={addStudentToGroup}
          slotIndex={slotIndex}
          groupIndex={groupIndex}
          highlightBookingNumber={highlightBookingNumber}
          setHighlightBookingNumber={setHighlightBookingNumber}
        />
      ))}
    </div>
  </div>
);


export default Slot;
