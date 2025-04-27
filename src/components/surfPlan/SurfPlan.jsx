import React from "react";
import "./surfPlan.css";
import Slot from "../slot/slot";
import Student from "../Student/Student";

console.log("SurfPlan 💕");

const SurfPlan = ({ plan }) => {
  if (!plan) return <p>No plan available.</p>;

  return (
  <div className="surfplan-container">
      <h2>Surf Plan for {plan.date}</h2>
      {plan.slots.map((slot, i) => (
        <Slot key={i} slot={slot} />
      ))}
      <p>Non-participating guests:</p>
      <ul>
          {plan.non_participating_guests.map((guest) => (
            <Student key={guest.student_id} student={guest} />
          ))}
        </ul>
    </div>
  );
};
// console.log(SurfPlan);

// console.log("Slot 🧰");

// const Slot = ({ slot }) => (
//     <div className="slot-container">
//     <h3>{slot.time}</h3>
//     <div className="groups-container">
//       {slot.groups.map((group, i) => (
//         <Group key={i} group={group} />
//       ))}
//     </div>
//   </div>
// );

// console.log(Slot);

// console.log("Groups 🙏");

// const Group = ({ group }) => (
//   <div className="group-container">
//     <p><strong>Level:</strong> {group.level}</p>
//     <p><strong>Age Group:</strong> {group.age_group}</p>
//     <p><strong>Students:</strong></p>
//     <ul>
//   {group.students.map((student) => (
//     <li key={student.student_id}>{student.first_name} {student.last_name}</li>
//   ))}
// </ul>
//     <div className="instructor-circle">
//      <p>EH</p>
//     </div>
//   </div>
// );

// console.log(Group);


export default SurfPlan;
