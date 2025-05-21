import React from "react";
import Guest from "../Guest/Guest"
import "./nonParticipatingGuests.css";

const NonParticipatingGuests = ({ non_participating_guests = [], onAddGuest }) => {
  if (non_participating_guests.length === 0) {
    return <p>No guests available</p>;
  }
  return(
  <div className="guest-list"><p>Non-participating guests:</p>

    <ul aria-label='non-participating guests'>
          {non_participating_guests.map((guest) => (
            <Guest key={guest.student_id} student={guest} onClick={onAddGuest}/>
          ))}
        </ul>
  </div>
)};

export default NonParticipatingGuests;
