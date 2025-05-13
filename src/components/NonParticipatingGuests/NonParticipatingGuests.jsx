import React from "react";
import Student from "../Student/Student"

const NonParticipatingGuests = ({ non_participating_guests = [] }) => {
  if (non_participating_guests.length === 0) {
    return <p>No guests available</p>;
  }
  return(
  <div><p>Non-participating guests:</p>
    <ul aria-label='non-participating guests'>
          {non_participating_guests.map((guest) => (
            <Student key={guest.student_id} student={guest} />
          ))}
        </ul>
  </div>
)};

export default NonParticipatingGuests;
