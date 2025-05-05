import React, { useState } from "react";
import Student from "../Student/Student";
import NonParticipatingGuests from "../NonParticipatingGuests/NonParticipatingGuests";
import "./group.css";

const Group = ({ group, removeStudent, non_participating_guests}) => {
  const[showGuests, setShowGuests] = useState(false)

  return (
  <div className="groups-item">
  <p>{group.level} – {group.age_group}</p>
    <ul aria-label={`${group.level} – ${group.age_group}`}>
    {group.students.map((student) => (
      <Student
        key={student.student_id}
        student={student}
        removeStudent={removeStudent}
      />
    ))}
  </ul>
  <button id="btn-participants" onClick={() => setShowGuests((prev) => !prev)}>+ add students</button>
  {showGuests && (
        <NonParticipatingGuests
          non_participating_guests={non_participating_guests}
        />
      )}
  <div className="instructor-circle">
    <p className="instructor-label">EH</p>
  </div>
  </div>
);
}
export default Group;
