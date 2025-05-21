import React from "react";
import "./surfPlan.css";
import Slot from "../slot/slot";

console.log("SurfPlan 💕");

const SurfPlan = ({ plan, removeStudent, addStudentToGroup }) => {
  if (!plan) return <p>No plan available.</p>;

  return (
  <div className="surfplan-container">
      <h2>Surf Plan for {plan.date}</h2>
      {plan.slots.map((slot, slotIndex) => (
        <Slot
          key={slotIndex}
          slot={slot}
          slotIndex={slotIndex}
          removeStudent={removeStudent}
          addStudentToGroup={addStudentToGroup}
          non_participating_guests={plan.non_participating_guests}
        />
      ))}
    </div>
  );
};

export default SurfPlan;
