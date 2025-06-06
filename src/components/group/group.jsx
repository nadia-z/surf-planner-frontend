import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../constants/ItemTypes";
import Student from "../Student/Student";
import NonParticipatingGuests from "../NonParticipatingGuests/NonParticipatingGuests";
import "./group.css";

const Group = ({
  group,
  removeStudent,
  non_participating_guests = [],
  addStudentToGroup,
  slotIndex,
  groupIndex,
}) => {
  const [showGuests, setShowGuests] = useState(false);
  const guestsRef = useRef(null);

  // Drag and drop setup
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.STUDENT,
    drop: (item) => {
      const studentId = item.student.student_id;
      removeStudent(studentId);
      addStudentToGroup(studentId, slotIndex, groupIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Close guest list if click outside
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

  const handleAddGuest = (guestId) => {
    addStudentToGroup(guestId, slotIndex, groupIndex);
  };

  return (
    <div className="groups-item" ref={drop} style={{ backgroundColor: isOver ? "#e0f7fa" : "white" }}>
      <p>
        {group.level} – {group.age_group}
      </p>
      <ul aria-label={`${group.level} – ${group.age_group} – ${slotIndex}`}>
        {group.students.map((student) => (
          <Student key={student.student_id} student={student} removeStudent={removeStudent} />
        ))}
      </ul>
      <button id="btn-participants" onClick={() => setShowGuests(true)}>
        + add students
      </button>
      {showGuests && (
        <div ref={guestsRef}>
          <NonParticipatingGuests
            non_participating_guests={non_participating_guests}
            onAddGuest={handleAddGuest}
          />
        </div>
      )}
      <div className="instructor-circle">
        <p className="instructor-label">EH</p>
      </div>
    </div>
  );
};

export default Group;
