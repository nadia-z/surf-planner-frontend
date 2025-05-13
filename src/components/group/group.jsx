import React, { useState, useRef, useEffect } from "react";
import Student from "../Student/Student";
import NonParticipatingGuests from "../NonParticipatingGuests/NonParticipatingGuests";
import "./group.css";

const Group = ({ group, removeStudent, non_participating_guests = []}) => {
  const[showGuests, setShowGuests] = useState(false);
  const guestsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuests(false);
      }
    };

    if (showGuests) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuests]);

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
  <button id="btn-participants" onClick={() => setShowGuests(true)}>+ add students</button>
  {showGuests && (
      <div ref={guestsRef} className="guest-popup">
        <NonParticipatingGuests
          non_participating_guests={non_participating_guests}
        />
      </div>
      )}
  <div className="instructor-circle">
    <p className="instructor-label">EH</p>
  </div>
  </div>
);
}
export default Group;
